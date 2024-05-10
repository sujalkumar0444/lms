const router = require('express').Router();
const { Course, Module, Lesson , CourseProblem ,Assessments} = require("../../models/course_work");

router.post('/:courseid', async (req, res) => {
    try {
        const courseid = req.params.courseid;

        const course = await Course.findOne({ _id: courseid });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const modules = await Module.find({ _id: { $in: course.modules } });
        const lessonIds = modules.reduce((acc, module) => {
            return acc.concat(module.lessons);
        }, []);

        const lessons = await Lesson.find({ _id: { $in: lessonIds } });
        const problemIds = lessons.filter(lesson => lesson.problem_id).map(lesson => lesson.problem_id);
        const assessmentIds = lessons.filter(lesson => lesson.assessment_ref).map(lesson => lesson.assessment_ref);

     
        await Assessments.deleteMany({ _id: { $in: assessmentIds } });
        await CourseProblem.deleteMany({ _id: { $in: problemIds } });
        await Lesson.deleteMany({ _id: { $in: lessonIds } });
        await Module.deleteMany({ _id: { $in: course.modules } });
        await Course.deleteOne({_id: courseid });

        res.json({ message: 'Course and associated data deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
