const router = require('express').Router();
const { Lesson, CourseProblem, Assessments, Module, Course } = require("../../models/course_work");

// Endpoint to add content
router.post('/', async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.body.lessonid);

        // lesson.lesson_no=req.body.lesson_no;
        // lesson.contentype=req.body.contentype;
        lesson.lesson_title=req.body.lesson_title;
        if(req.body.lesson_points)
            {
                const module = await Module.findById(req.body.moduleid);
                module.module_total_score=module.module_total_score-lesson.lesson_points+req.body.lesson_points;
                await module.save();
                lesson.lesson_points=req.body.lesson_points;
                
            }
        
        if(req.body.text_content)
            {
                lesson.text_content=req.body.text_content;
            }
        if(lesson.problem_id)
            {
                const problem = await CourseProblem.findOne({_id : lesson.problem_id});
                problem.problem_title=req.body.problem_title;
                problem.problem_description=req.body.problem_description;
                problem.sample_test_cases=req.body.sample_test_cases;
                problem.hidden_test_cases=req.body.hidden_test_cases;
                await problem.save();
            }
        if(req.body.assessment_ref)
            {
                return res.status(404).send("Please don't update Assessment");
            }

        await lesson.save();

        res.send("updated lesson");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;