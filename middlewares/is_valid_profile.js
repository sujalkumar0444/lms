const axios=require("axios");   
const Codechefclass=require("../modules/sites/codechef");
const Codeforcesclass = require("../modules/sites/codeforces");
const Hackerrankclass = require("../modules/sites/hackerrank");
const Spojclass = require("../modules/sites/spoj");


module.exports = async function is_valid_profile(req,res,next){
    let leetcode_handle=req.body.leetcode;
    let response=await axios.get(`http://localhost:8800/leetcode/${leetcode_handle}`);
    // console.log(response.data.errors);
    // body.leetcode_data=response.data;
    if(response.data.errors) {
        res.status(400).json({"error":"enter valid leetcode handle"});
        return;
    }
    let codechef_obj=new Codechefclass(req.body.codechef);
    // console.log(codechef_obj.is_valid_handle());
    if(! await codechef_obj.is_valid_handle()){
        res.status(400).json({"error":"enter valid codechef handle"});
        return;
    }
    let codeforces_obj=new Codeforcesclass(req.body.codeforces);
    // console.log(await codeforces_obj.is_valid_handle());
    if(! await codeforces_obj.is_valid_handle()){
        res.status(400).json({"error":"enter valid codeforces handle"});
        return;
    }
    let hackerrank_handle=req.body.hackerrank;
    let hackerranks_obj=new Hackerrankclass(hackerrank_handle);
    if(! await hackerranks_obj.is_valid_handle()){
        res.status(400).json({"error":"enter valid hackerrank handle"});
        return;
    }

    let spoj_handle=req.body.spoj;
    // console.log(spoj_handle);
    let spoj_obj=new Spojclass(spoj_handle);
    // console.log(await spoj_obj.is_valid_handle());
    if(! await spoj_obj.is_valid_handle()){
        res.status(400).json({"error":"enter valid spoj handle"});
        return;
    }

    next();
}
