const router=require('express').Router();
let leaderboard_model=require("../../models/leaderboard");
let user_model=require("../../models/user");

router.get("/",async(req,res)=>{
    let data=await leaderboard_model.find({}).sort({ total_leaderboard_score:-1 });
    let rank=1;
    let roll_no = req.roll_no;
    const studentData = await user_model.findOne({ roll_no });
    if (!studentData) {
        // If student data not found, send an error response
        return res.status(404).json({ message: 'Student data not found' });
    }
    let ret=data.filter(item => studentData.graduation_year === item.graduation_year)
                .map((item)=>{
        let row=item._doc;
        return {
            name:row.user_name,
            roll_no:row.roll_no,
            branch:row.branch,
            email:row.email,
            leetcode: row.lc_leaderboard_score,
            codeforces:row.cf_leaderboard_score,
            codechef:row.cc_leaderboard_score,
            hackerrank:row.hr_leaderboard_score,
            spoj:row.spoj_leaderboard_score,
            totalScore:row.total_leaderboard_score,
            rank:rank++
        }
    });
    console.log(ret);
    res.json({result:ret});  
});
module.exports = router;