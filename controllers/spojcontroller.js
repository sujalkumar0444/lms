const Spojclass = require('../modules/sites/spoj');
const moment = require('moment');

let spoj_stats=async (req,res)=>{
    const handle = req.params.handle;
    const spoj = new Spojclass(handle);
    // for now retrieving submissions before 2023-02-17 08:50:08
    const submissions = await spoj.get_submissions(moment('2023-02-17 08:50:08'));
    console.log(submissions);
    res.send(submissions);
} 

module.exports = {spoj_stats};