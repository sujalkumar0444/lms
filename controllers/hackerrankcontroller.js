const Hackerrankclass = require('../modules/sites/hackerrank');
const moment=require('moment');


let hackerrankstat=async(req, res) => {
    let handle = req.params.handle;
    let obj = new Hackerrankclass(handle);
    // for now retrieving submissions before 2024-03-05 12:00:00
    let data = await obj.get_submissions(moment('2024-03-05 12:00:00'));
    res.send(data);
}

module.exports={
    hackerrankstat
}