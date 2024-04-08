let axios = require('axios');
let moment = require('moment');
const { model } = require('mongoose');


class Hackerrankclass{
    constructor(handle){
        this.site = "HackerRank"
        this.handle = handle
        this.headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Host': 'www.hackerrank.com',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'TE': 'trailers',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
            // 'Cookie': cookieValue
        }
    }    
    async is_valid_handle(){
        try{
            let handle=this.handle;
            let headers=this.headers;
            let url = `https://www.hackerrank.com/rest/hackers/${handle}/recent_challenges?limit=20&response_version=v2&`;
            let response = await axios.get(url, {
                headers: headers
            });
            // console.log(response.status);
            if(parseInt(response.status) == 200){
                return true;
            }
        }catch{
            return false;
        }
        
    }
     async get_submissions(last_retrieved){
        let headers=this.headers;
         last_retrieved = moment(last_retrieved).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
        
        try {
            let handle=this.handle;
            let submissions = [];
            // const cookieValue = 'hackerrank_mixpanel_token=f07c3bb3-c50f-4859-9996-08d19ddded62; hrc_l_i=F';
            
            const url = `https://www.hackerrank.com/rest/hackers/${handle}/recent_challenges?limit=20&response_version=v2&`;
            let axios_res=await axios.get(url,{
                headers: headers
            });
            let respose = axios_res.data;
                for(const row of respose.models){
                    let timestamp = moment(row.created_at).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                    if (moment(timestamp) <= moment(last_retrieved)) {
                        return submissions;
                    }
                    submissions.push(row);
                    if (respose.last_page) {
                        break;
                    }    
                }
            for(let  i=0;i<10;i++){
                console.log("cycle: "+i);
                let cursor = respose.cursor;
                const url = `https://www.hackerrank.com/rest/hackers/${handle}/recent_challenges?limit=20&response_version=v2&cursor=${cursor}`;
                 respose = await axios.get(url,{
                    headers: headers
                });
                respose=respose.data;
                    for(const row of respose.models){
                        let  timestamp = moment(row.created_at).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                        if (moment(timestamp) <= moment(last_retrieved)) {
                            return submissions;
                        }
                        submissions.push(row);
                        if (respose.last_page) {
                            break;
                        }    
                    }
                    if(respose.models.length==0){
                        return submissions;
                    }
            }
            } catch (error) {
            console.log(error);
            console.log("error");
            }
        
        
    }
    
}
// async function main(){
//     let obj=new Hackerrank('bhargavdh5');
//     // console.log(await obj.is_invalid_handle());
//     let data = await obj.get_submissions(moment('2024-03-05 12:00:00'));
//      console.log(data); 
// }
// main();

module.exports = Hackerrankclass;