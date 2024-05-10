const router = require('express').Router();
const { Module ,Lesson , CourseProblem ,Assessments}=require("../../models/course_work");
router.post('/', async (req, res) => {
    try {
        const lessonid = req.body.lessonid;
        const moduleid = req.body.moduleid;


        const lesson = await Lesson.findOne({ _id: lessonid });
        

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        
        
        const problem_id=lesson.problem_id;
        const assessment_ref=lesson.assessment_ref;
            

        if(problem_id)
            {
        await CourseProblem.deleteOne({ _id: problem_id });
        const module = await Module.findOne({ _id: moduleid });
        module.module_total_score=module.module_total_score-lesson.lesson_points;
        await module.save();

         }
         if(assessment_ref)
            {
        await Assessments.deleteOne({ _id: assessment_ref });
         }
         await Lesson.deleteOne({ _id: lessonid });


         res.json({ message: 'Lesson and associated data deleted successfully' });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
