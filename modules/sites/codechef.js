const axios=require('axios')
const moment = require('moment');
const { JSDOM } = require('jsdom');
const cheerio = require('cheerio');

class Codechefclass {
    constructor(handle){
        this.site = "Codechef";
        this.handle = handle;
    }
    async is_valid_handle(){
        let handle=this.handle;
        try {
            const baseURL = `https://www.codechef.com/recent/user?page=0&user_handle=${handle}&_=1710851539301`;
            const response = await axios.get(baseURL);
            const html = response.data;
            const pagecount = html.max_page;
            if(pagecount>0)return true;
            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    async get_credentials(){
        let handle=this.handle;
        try {
            let data = await axios.get(`https://www.codechef.com/users/${handle}`);
            let dom = new JSDOM(data.data);
            let document = dom.window.document;
            
            // get all the links in the problems solved section
            const linksArray = [];
            const sett=new Set();
            const linkarr = document.querySelector('section.rating-data-section:nth-child(7)').querySelectorAll('p a')
            linkarr.forEach(link => {
            const href = link.getAttribute('href');
            const content = link.childNodes[0].data;
            // console.log(href);
            let check=href.split('/');
            check=check[check.length-1];
            // console.log(check);
            if(!sett.has(check)){
                sett.add(check);
                linksArray.push({ href, content });
            }
            });
    
            // response data 
            return({
                success: true,
                profile: document.querySelector('.user-details-container').children[0].children[0].src,
                name: document.querySelector('.user-details-container').children[0].children[1].textContent,
                currentRating: parseInt(document.querySelector(".rating-number").textContent),
                highestRating: parseInt(document.querySelector(".rating-number").parentNode.children[4].textContent.split('Rating')[1]),
                countryFlag: document.querySelector('.user-country-flag').src,
                countryName: document.querySelector('.user-country-name').textContent,
                globalRank: parseInt(document.querySelector('.rating-ranks').children[0].children[0].children[0].children[0].innerHTML),
                countryRank: parseInt(document.querySelector('.rating-ranks').children[0].children[1].children[0].children[0].innerHTML),
                stars: document.querySelector('.rating').textContent || "unrated",
                problemsSolved: linksArray.length,
            });
        } catch (err) {
            return({ success: false, error: err });
            
        }  
    }

    async  scrapeRecentActivity( page, existingQuestions,last_retrived) {
        last_retrived=moment(last_retrived).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'); 
        let username = this.handle;
        try {
            console.log("cycle"+page);
            var acceptedSolutions = [];
          
            const baseURL = `https://www.codechef.com/recent/user?page=${page}&user_handle=${username}&_=1710851539301`;
            const response = await axios.get(baseURL);
            const html = response.data;
    
            const pagecount = html.max_page;
            // console.log(pagecount);
            var htmlContent = html.content;
    
            const $ = cheerio.load(htmlContent);
    
            // Find all table rows
            var rows = $('tr');
            let flag=false;
            rows.each(function () {
                if(flag)return;
                var cols = $(this).find('td');
                if (cols.length >= 3) {
                    var time = $(cols[0]).attr('title');
                    var problem = $(cols[1]).text().trim();
                    var problemLink = $(cols[1]).find('a').attr('href');
                    var result = $(cols[2]).find('span').attr('title');
                    //console.log(typeof time);
                    
                    //time=(time.split(' ')[2]=="ago")?():(moment(time, 'hh:mm A DD/MM/YY'));
                    if (result === 'accepted') {
                        if(time.split(' ')[2]==="ago"){
                            console.log(time);
                            let to_check=time.split(' ')[1];
                            let dt='';
                            switch(to_check[0]){
                                case 's':dt='seconds';break;
                                case 'm':dt='minutes';break;
                                case 'h':dt='hours';break;
                            }
                            const duration = moment.duration(parseInt(time.split(' ')[0]), dt);
                            time=moment(moment()).subtract(duration);
                            
                            time=time.utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                            console.log(time);
    
                        }else {
                            time=(moment(time, 'hh:mm A DD/MM/YY'));
                        }
    
                        // Check if the last word is not already present
                        const parts = problemLink.split('/');
                        const lastWord = parts[parts.length - 1];
                        const thirdToLastWord = parts[parts.length - 3];
                        if (!existingQuestions.has(lastWord)) {
                            time=moment(time).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                            // console.log(last_retrived,time);
                             if(last_retrived >= time){
                                flag=true;return;
                            }
                            acceptedSolutions.push({ time: time, problem: problem, problemLink: thirdToLastWord ? `https://www.codechef.com/${thirdToLastWord}/problems/${lastWord}` : `https://www.codechef.com/problems/${lastWord}` });
                            existingQuestions.add(lastWord);
                           // Add the last word to the set
                        }
                    }
                }
            });

            if (page < pagecount && !flag ) {
                const nextPageSolutions = await this.scrapeRecentActivity( page + 1, existingQuestions,last_retrived);
                // Concatenate the solutions from current page and next page
                acceptedSolutions = acceptedSolutions.concat(nextPageSolutions);
                
            }
            return acceptedSolutions;
    
        } catch (error) {
            console.error('Error occurred while scraping recent activity:', error);
            throw error; 
        }
}


    async fetch_from_time(last_retrived){
        last_retrived=moment(last_retrived).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
        return this.scrapeRecentActivity( 0, new Set(),last_retrived);
    }
}

//  async function main(){
//     let codechef = new Codechefclass("m_2002for2025");   
// //     // let data = await codechef.get_credentials();
//     let data= await codechef.get_credentials();
//     console.log(data);
// }
// main();

module.exports = Codechefclass;