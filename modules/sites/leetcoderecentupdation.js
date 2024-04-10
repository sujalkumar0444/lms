const moment = require('moment-timezone');
const axios = require('axios');
async function lcupdate(roll_no,handle){
    console.log("leetcode update method called_________________________");
    console.log("Inside leetcode");
const Problems_model=require("../../models/all_problems");
const solved_model=require("../../models/solved_problems");

async function get_submissions(last_refreshed,handle)
{
const url = 'https://leetcode.com/graphql/';
 const payload = {
        query: `
        query recentAcSubmissions($username: String!, $limit: Int!) {
            recentAcSubmissionList(username: $username, limit: $limit) {
              title
              timestamp
              titleSlug
            }
          }
        `,
        variables: {
          username:handle,
          limit:15
        }
    };

    try {
        
        const response = await axios.post(url, payload);
        const acSubmissions = response.data.data.recentAcSubmissionList;
        console.log(moment(last_refreshed));
        const submissions = acSubmissions
            .filter(submission => {
                const submissionTimestamp = moment.unix(submission.timestamp); // Convert timestamp to milliseconds
                // console.log(submissionTimestamp);
                return submissionTimestamp > moment(last_refreshed);
            })
            .map(submission => ({
                title: submission.title,
                time: moment.unix(submission.timestamp).toDate(), // Convert timestamp to milliseconds
                url: "https://leetcode.com/problems/"+submission.titleSlug
            }));
            return submissions;

       
     
    } catch (error) {
        console.error('Error:', error);
        return "error";
    }
}

async function start()
{
   
    try
    {
    let solved_doc=await solved_model.find({roll_no:roll_no});
    if(solved_doc.length==0)return "failed";
    let { _id,leetcode_last_refreshed}=solved_doc[0]; 
    let submissions=await get_submissions(leetcode_last_refreshed,handle);
    if(submissions=="error")return "error";
    console.log(submissions);
    if(submissions.length > 0 ){
        leetcode_last_refreshed=moment(submissions[0]?.time).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
        let solved_doc_for_update= await solved_model.findById(_id);
        solved_doc_for_update.leetcode_last_refreshed=leetcode_last_refreshed;
        await solved_doc_for_update.save();
    }
    for (const element of submissions) {
        let problem_doc = await Problems_model.findOne({ problem_name: element.title });
        if (problem_doc) {
            let solved_doc_for_update = await solved_model.findById(_id);
            console.log("inside available in cf db");
            let problemId = problem_doc._id;
            console.log("problemId",problemId);
            // Check if the problemId is not already in the array
            // console.log(solved_doc.leetcode_solved);
            if (! solved_doc_for_update.leetcode_solved.some(entry => entry.problem.equals(problemId))) {
                console.log("problemId not available in leetcode_solved array");

                solved_doc_for_update.leetcode_solved.push({problem:problemId,date: element.time}); // Add to array

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
                problem_name: element.title,
                problem_href: element.url,
                site_name: "LeetCode"
            };
            let newProblem = await Problems_model.create(problem_data);
            let problemId = newProblem._id;
    
            // Check if the problemId is not already in the array
            if (!solved_doc_for_update.leetcode_solved.some(entry => entry.problem.equals(problemId))) {
                solved_doc_for_update.leetcode_solved.push({problem:problemId,date: element.time}); // Add to array
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
let data = await start();
 console.log(data); 
}


module.exports=lcupdate;


