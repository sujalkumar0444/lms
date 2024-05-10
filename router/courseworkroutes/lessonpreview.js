const router = require('express').Router();
const { Lesson } = require("../../models/course_work");

router.get('/:lessonid', async (req, res) => {
    try {
        let lessonid = req.params.lessonid;
        let lesson = await Lesson.findOne({ _id: lessonid }).select('-_id -lesson_no -contentype').populate([
            { 
                path: 'problem_id', 
                model: 'CourseProblem', 
            }, 
            { 
                path: 'assessment_ref', 
                model: 'Assessments', 
                populate: { 
                    path: 'problems.problem_ref', 
                    model: 'CourseProblem',
                } 
            } 
        ]);

        // Conditionally exclude lesson_points if its value is 0
        if (lesson && lesson.lesson_points !== 0) {  
            res.json(lesson);
        } else if (lesson) {
            // Omit lesson_points from lesson object
            lesson = lesson.toObject();
            delete lesson.lesson_points;
            res.json(lesson);
        } else {
            res.status(404).json({ message: 'Lesson not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
