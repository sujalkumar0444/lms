const jsdom=require('jsdom');
const { JSDOM } = jsdom;    
const axios = require('axios'); 
const moment = require('moment');


class Spojclass{ 
    constructor(handle){
        this.site = "Spoj";
        this.handle = handle;
    }
     // Define your list of request failure status codes
    async  is_valid_handle() {
        let handle = this.handle;
        const REQUEST_FAILURES = [400, 401, 403, 404, 429];
        try {
            const response = await axios.get(`http://www.spoj.com/users/${handle}`, { timeout: 10000 });
            
            if (REQUEST_FAILURES.includes(response.status)) {
            return false;
            }

            // Check if the handle exists by searching for a specific text in the response body
            if (response.data.includes("History of submissions")) {
            return true; // Handle exists
            } else {
            return false; // Handle does not exist
            }
        } catch (error) {
            // Handle request errors or timeouts
            console.error("Error checking handle:", error);
            return false; // Consider it as an invalid handle due to error
        }
    }

    
    // _________________________________________________________todo
    
    async get_stats(last_retrieved){
        let response = await axios.get(`http://www.spoj.com/users/${this.handle}`);
        response = response.data;
        // console.log(response);
        const dom = new JSDOM(response);
        const document = dom.window.document;
        return {
            "user_name": document.querySelector('#user-profile-left > h3:nth-child(2)').innerHTML,
            "World_Rank":document.querySelector('#user-profile-left > p:nth-child(6)').innerHTML.slice(-17),
            "Problems_solved":document.querySelector('.dl-horizontal > dd:nth-child(2)').innerHTML,
        }
    }


    async get_submissions(last_retrieved){
        console.log("get subbmission method")
        last_retrieved = moment(last_retrieved).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
        let last_page_retrieved = moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
        let handle = this.handle;
        const baseUrl = `https://www.spoj.com/status/${handle}/all/start=`;
        const results = [];

        let start = 0;

        while (true) {
        console.log("Fetching page", start / 20 + 1);
        const nextPageUrl = baseUrl + start;
        const response = await axios.get(nextPageUrl);
        const html = await response.data

        const dom = new JSDOM(html);
        const doc = dom.window.document;
        if(! doc.querySelectorAll(".kol1")[0])return results;
        let first_one=moment(doc.querySelectorAll(".kol1")[0].querySelector(".status_sm span")?.getAttribute("title")).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss')
        console.log("firstone=",first_one,"lastone=",last_page_retrieved);
        if(last_page_retrieved == first_one){
            return results;
        }else{
            last_page_retrieved=first_one
        }

        
        const problemRows = Array.from(doc.querySelectorAll(".kol1")).map((element) => {
            const timestamp = element.querySelector(".status_sm span")?.getAttribute("title");
            const problemLink = element.querySelector(".sproblem a");
            const problemName = problemLink.textContent.trim();
            const problemUrl = problemLink.getAttribute("href");
            const formattedTimestamp = moment(timestamp).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
            return {
            time: formattedTimestamp,
            name: problemName,
            link: `https://www.spoj.com${problemUrl}`,
            };
        });

        // console.log(results.length);
        if (problemRows.length === 0) {
            return results;
            break;
        }

        for(let row of problemRows){
            let timestamp = moment(row.time).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
            if (moment(timestamp) <= moment(last_retrieved)) {
                return results;
            }
            results.push(row);
        }
        start += 20; // Increment start index for the next page
        }

        return (results);
    }
}


// async function main(){
//     const spoj = new Spojclass("abhi033");
//      const data = await spoj.get_submissions(moment('2001-02-1 08:50:08'));
//     // const data = await spoj.get_stats();
//     console.log(data);
//     // console.log(await spoj.get_stats());
// }
// main();


module.exports = Spojclass;