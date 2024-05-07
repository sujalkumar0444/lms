const router=require('express').Router();
let courseleaderboard=require("../../models/course_leaderboard");
const { Course }=require("../../models/course_work");
let user_model=require("../../models/user");

router.get("/",async(req,res)=>{
    let data=await courseleaderboard.find({courseid:req.body.courseid}).sort({ score:-1 });
    let rank=1;
    // console.log(data);
    let roll_no = req.roll_no;
    const studentData = await user_model.findOne({ roll_no });
    if (!studentData) {
        // If student data not found, send an error response
        return res.status(404).json({ message: 'Student data not found' });
    }
    const course_data = await Course.findOne({ courseid: req.body.courseid });
    if (!course_data) {
        // If student data not found, send an error response
        return res.status(404).json({ message: 'Course not found' });
    }

    if(!studentData.enrolled_courses.includes(req.body.courseid))
        {
            return res.status(500).json({ message: 'User not enrolled' });
        }
    let ret=data.filter(item => studentData.graduation_year === item.graduation_year)
                .map((item)=>{
        let row=item._doc;
        return {
            name:row.user_name,
            roll_no:row.roll_no,
            score:row.score,
            rank:rank++
        }
    });
    console.log(ret);
    res.json({result:ret});  
});
module.exports = router;