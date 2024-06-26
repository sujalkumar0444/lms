const router = require('express').Router();
const { Lesson ,CourseProblem} = require("../../models/course_work");

router.get('/:lessonid', async (req, res) => {
    try {
        let lessonid = req.params.lessonid;
        let lesson = await Lesson.findOne({ _id: lessonid }).select('-_id -lesson_no -contentype');
        if(!lesson)
            {
                return res.status(404).json({ message: 'Lesson not found' });
            }
        let result={};
        result.lesson_title=lesson.lesson_title;
        if(lesson.problem_id)
            {
             let problem = await CourseProblem.findOne({ _id: lesson.problem_id });
             result.lesson_points=lesson.lesson_points;
             result.problem_id={};
             result.problem_id.problem_id=problem._id;
             result.problem_id.problem_title=problem.problem_title;
             result.problem_id.problem_description=problem.problem_description;
             result.problem_id.sample_test_cases = problem.sample_test_cases.map(testCase => {
                const { _id, ...rest } = testCase.toObject();
                return rest;
            });
            
            result.problem_id.hidden_test_cases = problem.hidden_test_cases.map(testCase => {
                const { _id, ...rest } = testCase.toObject(); 
                return rest;
            });
            

            }
            else if(lesson.text_content)
            {
             result.text_content=lesson.text_content;
            }
            else{
               return res.status(404).json({ message: 'Assessment cant be previewed' });
            }

            res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
