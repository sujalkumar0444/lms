const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let Codechefclass=require('../modules/sites/codechef');

const codechefstats=async (req,res)=>{    
    let handle = req.params.handle; 
    let codechef = new Codechefclass(handle); 
    let data=await codechef.get_credentials();
     console.log(data);
     res.send(data);
}

const recent_submissions=async (req,res)=>{    
    let handle = req.params.handle; 
    let codechef = new Codechefclass(handle); 
    let data=await codechef.scrapeRecentActivity( 0, new Set());
     console.log(data);
     res.send(data);
}

module.exports = {
    codechefstats,
    recent_submissions,
}