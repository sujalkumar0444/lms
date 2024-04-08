
const codeforcesclass = require('../modules/sites/codeforces');
const moment = require('moment');

let codeforces_stats=async (req,res)=>{
    let handle = req.params.handle;
    let obj = new codeforcesclass(handle);
    // for now retrieving submissions before 2024-03-05 12:00:00
    let data = await obj.fetchSubmissions(moment('2023-03-05 12:00:00'));
    res.send(data);
}

module.exports={
    codeforces_stats
}