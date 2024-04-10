const axios = require('axios');
const moment = require('moment');
async function leetcode(cookie,roll_no){
    console.log("leetcode Initial update ________________________");
    console.log("Inside leetcode");
const Problems_model=require("../../models/all_problems");
const solved_model=require("../../models/solved_problems");

const url = 'https://leetcode.com/graphql/';

const headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7',
    // 'Authorization': 'Bearer YOUR_AUTH_TOKEN_HERE',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'Cookie': `${cookie}`,
    'Origin': 'https://leetcode.com',
    'Pragma': 'no-cache',
    'Random-Uuid': '241a4353-261e-6dd0-70b6-8fa67ffbad24',
    'Referer': 'https://leetcode.com/progress/?page=1&sortBy=lastSolved-asc',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Sentry-Trace': '1d9b3e9a9b6445c6b75dc6063dcd8935-92613d25ebd2c8ed-0',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    // 'X-Csrftoken': `${csrftoken}`
};

// Send the POST request using Axios
const submissions = [];
async function fetchProblems(pageNo) {
    // Define the payload
    const payload = {
        query: `
            query progressList($pageNo: Int, $numPerPage: Int, $filters: ProgressListFilterInput) {
                isProgressCalculated
                solvedQuestionsInfo(pageNo: $pageNo, numPerPage: $numPerPage, filters: $filters) {
                    currentPage
                    pageNum
                    totalNum
                    data {
                        totalSolves
                        question {
                            questionFrontendId
                            questionTitle
                            questionDetailUrl
                            difficulty
                            topicTags {
                                name
                                slug
                            }
                        }
                        lastAcSession {
                            time
                            wrongAttempts
                        }
                    }
                }
            }
        `,
        variables: {
            pageNo,
            numPerPage: 50, 
            filters: {
                orderBy: 'LAST_SOLVED',
                sortOrder: 'DESCENDING'
            }
        },
        operationName: 'progressList'
    };

    try {
        
        const response = await axios.post(url, payload, { headers });
        // console.dir(response.data.data, { depth: null });
        const currentPageSubmissions = response.data.data.solvedQuestionsInfo.data;
        // const currentPageSubmissions = response.data.data.solvedQuestionsInfo.data.map(submission => ({
        //     title: submission.question.questionTitle,
        //     url: "https://leetcode.com"+submission.question.questionDetailUrl,
        //     time: submission.lastAcSession.time
        // }));
        submissions.push(...currentPageSubmissions);
        // Check if there are more pages
        const pageInfo = response.data.data.solvedQuestionsInfo;
        const nextPage = pageInfo.currentPage + 1;
        const totalNumPages = Math.ceil(pageInfo.totalNum / 50); 

        if (nextPage <= totalNumPages) {
            await fetchProblems(nextPage);
            
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function start()
{
    await fetchProblems(1);
    try
    {
    let solved_doc=await solved_model.find({roll_no:roll_no});
    if(solved_doc.length==0)return "failed";
    let { _id,leetcode_last_refreshed}=solved_doc[0]; 
    if(submissions.length > 0 ){
        leetcode_last_refreshed=moment(submissions[0]?.lastAcSession.time).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
        let solved_doc_for_update= await solved_model.findById(_id);
        solved_doc_for_update.leetcode_last_refreshed=leetcode_last_refreshed;
        await solved_doc_for_update.save();
    }
   
    for (const element of submissions) {
        let problem_doc = await Problems_model.findOne({ problem_name: element.question.questionTitle });
        if (problem_doc) {
            let solved_doc_for_update = await solved_model.findById(_id);
            console.log("inside available in cf db");
            let problemId = problem_doc._id;
            console.log("problemId",problemId);
            // Check if the problemId is not already in the array
            // console.log(solved_doc.leetcode_solved);
            if (! solved_doc_for_update.leetcode_solved.some(entry => entry.problem.equals(problemId))) {
                console.log("problemId not available in leetcode_solved array");

                solved_doc_for_update.leetcode_solved.push({problem:problemId,date: element.lastAcSession.time}); // Add to array

                await solved_doc_for_update.save();
                console.log("Problem added to leetcode_solved array.");
            } else {
                console.log("Problem already exists in leetcode_solved array.");
            }
        } else {
            // Create a new problem and update solved_doc_for_update
            console.log("inside not available in lc db");
            let solved_doc_for_update = await solved_model.findById(_id);
            let problem_data = {
                problem_name: element.question.questionTitle,
                problem_href:  "https://leetcode.com"+element.question.questionDetailUrl,
                site_name: "LeetCode"
            };
            let newProblem = await Problems_model.create(problem_data);
            let problemId = newProblem._id;
    
            // Check if the problemId is not already in the array
            if (!solved_doc_for_update.leetcode_solved.some(entry => entry.problem.equals(problemId))) {
                solved_doc_for_update.leetcode_solved.push({problem:problemId,date: element.lastAcSession.time}); // Add to array
                await solved_doc_for_update.save();
                console.log("New problem created and added to leetcode_solved array.");
            } else {
                console.log("New problem already exists in leetcode_solved array.");
            }
            
        }
    }
    return "updated";
        }catch(err){
                console.log(err)
                console.log("error in leetcode updation");
                return "error";
}
    // console.log(submissions);

}
return await start();
}


module.exports=leetcode;


