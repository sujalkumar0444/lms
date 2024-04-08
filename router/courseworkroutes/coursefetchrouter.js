const router =require('express').Router();

let {Course,Lesson,Module,Assessments,CourseProblem}=require('../../models/course_work');

router.get('/',(req,res)=>{
    res.send('Courses');
});


router.get('/all', async (req, res) => {
    try {
        let courses = await Course.find({});
        let ret = [];
        for (let course of courses) {
            let obj = {};
            obj.courseid = course.courseid;
            obj.title = course.title;
            obj.description = course.description;
            obj.modules_count = course.modules.length;
            ret.push(obj);
        }
        res.json(ret);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// router.get("/:courseid",async (req,res)=>{
//     let courseid=req.params.courseid;
//     let course=await Course.findOne({courseid:courseid}).populate('modules');
//     let ret={};
//     // console.log(course.modules);
//     if(course){
//         ret.courseid=course.courseid;
//         ret.modules=course.modules;
//         res.json(ret);
//     }
//     else{
//         res.json({message:'Course not found'});
//     }
// });
router.get("/:courseid", async (req, res) => {
    let courseid = req.params.courseid;
    let ret={};
    try {
        let course = await Course.findOne({ courseid: courseid }).populate({
            path: 'modules',
            populate: {
                path: 'lessons',
                populate: [
                    { path: 'problem_id', model: 'CourseProblem' }, // Populate problem_id if exists
                    { path: 'assessment_ref', model: 'Assessments', populate: { path: 'problems.problem_ref', model: 'CourseProblem' } } // Populate assessment_ref if exists, and then populate problem_ref within problems array
                ]
            }
        });
        if (course) {
            ret.courseid=course.courseid;
        ret.modules=course.modules;
        res.json(ret);
            // res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports=router;  