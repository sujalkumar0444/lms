const router = require('express').Router();
const { Module, Lesson , CourseProblem ,Assessments }=require("../../models/course_work");
router.post('/:moduleid', async (req, res) => {
    try {
        const moduleid = req.params.moduleid;

        // Find the module by its ID
        const module = await Module.findOne({ _id: moduleid });

        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }

    
        const lessons = await Lesson.find({ _id: { $in: module.lessons } });
        const problemIds = lessons.filter(lesson => lesson.problem_id).map(lesson => lesson.problem_id);
        const assessmentIds = lessons.filter(lesson => lesson.assessment_ref).map(lesson => lesson.assessment_ref);


        await Assessments.deleteMany({ _id: { $in: assessmentIds } });
        await CourseProblem.deleteMany({ _id: { $in: problemIds } });
        await Lesson.deleteMany({ _id: { $in: module.lessons } });
        await Module.deleteOne({ _id: moduleid });

        res.json({ message: 'Module and associated data deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
