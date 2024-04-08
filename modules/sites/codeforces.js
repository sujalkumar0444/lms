const axios = require("axios");
const moment = require('moment');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class Codeforcesclass{
  constructor(handle){
    this.site = "Codeforces";
    this.handle = handle;
  }
   get_request = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return { error: 'Request failed' };
    }
  };
  
   is_valid_handle = async () => {
    let handle = this.handle;
    const apiUrl = `http://codeforces.com/api/user.status?handle=${handle}&from=1&count=2`;
    const response = await this.get_request(apiUrl);
    //console.log(response);
    if (response.status !== 'OK' || response.status=== 404) {
      return false;
    }
    return true;
  };

  async  fetchSubmissions(last_retrieved ) {
    last_retrieved = moment(last_retrieved).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
    let username = this.handle;
    let subbmisssionData=[];
    let from=1;
    try {
      for(let i =0;true;i++){
        console.log("cycle: "+i);
        const url = `https://codeforces.com/api/user.status?handle=${username}&from=${from}&count=20`;
        const response = await axios.get(url);
        const submissions = response.data.result;
    
        const successfulSubmissions = submissions.filter(
          (submission) => submission.verdict === "OK"
        );
        
        const extractedData = successfulSubmissions.map((submission) => {
          const submissionTime = moment.unix(submission.creationTimeSeconds).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
          const problemName = submission.problem.name;
          const problemLink = `https://codeforces.com/problemset/problem/${submission.problem.contestId}/${submission.problem.index}`;
          return { time: submissionTime, name: problemName, link: problemLink };
        });
        if(extractedData.length==0){
          return subbmisssionData;
        }
        for(let data of extractedData){
          if(data.time <= last_retrieved){
            return subbmisssionData;
          }
          subbmisssionData.push(data);
        }
        
  
        from+=20;
      }
      return subbmisssionData;
      
      
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  async fetchProfile(){
    let handle = this.handle;
    let url = `https://codeforces.com/profile/${handle}`;
    let data = await axios.get(url);
    let dom = new JSDOM(data.data);
    let document = dom.window.document;
    return{
      profilename:document.querySelector('.main-info > h1:nth-child(2) > a:nth-child(1)').innerHTML,
      stage:document.querySelector('.user-rank > span:nth-child(1)').innerHTML,
      rating:document.querySelector('.info > ul:nth-child(2) > li:nth-child(1) > span:nth-child(2)').innerHTML,
      max_rating:document.querySelector('span.smaller > span:nth-child(2)').innerHTML,  
      problems_solved:document.querySelector("html body div#body div div#pageContent.content-with-sidebar div._UserActivityFrame_frame div.roundbox.userActivityRoundBox.borderTopRound.borderBottomRound div._UserActivityFrame_footer div._UserActivityFrame_countersRow div._UserActivityFrame_counter div._UserActivityFrame_counterValue").innerHTML.split(" ")[0]
    }
  }

  rating_graph_data = async () => {
    let handle = this.handle;
    const website = 'https://codeforces.com/';
    const REQUEST_FAILURES = ['Request failed'];
    const SERVER_FAILURE = 'Server failure';

    const contestListUrl = `${website}api/contest.list`;
    const contestListResponse = await this.get_request(contestListUrl);
  
    if (REQUEST_FAILURES.includes(contestListResponse)) {
      return contestListResponse;
    }
  
    const contestList = contestListResponse.result;
    const allContests = {};
  
    contestList.forEach((contest) => {
      allContests[contest.id] = contest;
    });
  
    const profileUrl = `${website}contests/with/${handle}`;
    const profileResponse = await this.get_request(profileUrl);
  
    if (REQUEST_FAILURES.includes(profileResponse)) {
      return profileResponse;
    }
  
    const dom = new JSDOM(profileResponse);
    const document = dom.window.document;
    const tbody = document.querySelector('table.tablesorter tbody');
  
    if (!tbody) {
      console.error(`AttributeError for Codeforces handle: ${handle}`);
      return SERVER_FAILURE;
    }
  
    const contestData = {};
    tbody.querySelectorAll('tr').forEach((tr) => {
      const allTds = tr.querySelectorAll('td');
      const contestId = parseInt(allTds[1].querySelector('a').href.split('/').pop(), 10);
      const rank = parseInt(allTds[3].textContent.trim(), 10);
      const solvedCount = parseInt(allTds[4].querySelector('a').textContent.trim(), 10);
      const ratingChange = parseInt(allTds[5].querySelector('span').textContent.trim(), 10);
      const newRating = parseInt(allTds[6].textContent.trim(), 10);
      const contest = allContests[contestId];
      const timeStamp = moment.unix(contest.startTimeSeconds).format('YYYY-MM-DD HH:mm:ss');
      contestData[timeStamp] = {
        name: contest.name,
        url: `${website}contest/${contestId}`,
        rating: newRating.toString(),
        ratingChange,
        rank,
        solvedCount,
      };
    });
  
    return [{ title: 'Codeforces', data: contestData }];
  };

}


// async function main(){
//   let obj=new Codeforcesclass('d.2002pullstop');
//   // console.log(await obj.rating_graph_data());
//   // let data=await obj.fetchSubmissions(moment('2020-03-05 12:00:00'));
//   // let data=await obj.is_valid_handle();
//   let data=await obj.fetchProfile();
//   console.log(data);
// }
// main();

module.exports = Codeforcesclass;