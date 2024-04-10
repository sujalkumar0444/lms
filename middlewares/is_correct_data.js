const axios=require("axios");   

module.exports = async function is_valid_profile(req,res,next){
    // let csrftoken=req.body.csrftoken;
    let cookie=req.body.cookie;
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
    // 'X-Csrftoken':  `${csrftoken}`
};

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
            pageNo : 1,
            numPerPage: 10, 
            filters: {
                orderBy: 'LAST_SOLVED',
                sortOrder: 'DESCENDING'
            }
        },
        operationName: 'progressList'
    };
        const response = await axios.post(url, payload, { headers });
        // console.dir(response.data.data, { depth: null });
       
       
    if(response.data.errors) {
        res.status(400).json({"error":"Please enter correct cookie"});
        return;
    }
    next();
}
