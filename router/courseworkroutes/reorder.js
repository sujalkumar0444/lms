const router=require('express').Router();
const { Module, Course }=require("../../models/course_work");

router.post('/modules', async (req, res) => {
    const courseId = req.body.courseId;
    const newModuleOrder = req.body.newModuleOrder;

    try {
        // Fetch the course from the database and populate the modules
        const course = await Course.findById(courseId).populate('modules');

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Rearrange modules according to the new order
        const reorderedModules = [];
        for (const moduleNo of newModuleOrder) {
            const module = course.modules.find(mod => mod.module_no === moduleNo);
            if (module) {
                reorderedModules.push(module);
            }
        }
 
        // Update module numbers
        reorderedModules.forEach((module, index) => {
            module.module_no = index + 1;
        });
        await Promise.all(reorderedModules.map(module => module.save()));
        // Save the updated course
        course.modules = reorderedModules;
        await course.save();

        res.json({ message: 'Modules reordered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/lessons', async (req, res) => {
    const moduleId = req.body.moduleId;
    const newLessonOrder = req.body.newLessonOrder;

    try {
        // Fetch the module from the database and populate the lessons
        const module = await Module.findById(moduleId).populate('lessons');

        if (!module) {
            return res.status(404).json({ error: 'Module not found' });
        }

        // Rearrange lessons according to the new order
        const reorderedLessons = [];
        for (const lessonNo of newLessonOrder) {
            const lesson = module.lessons.find(les => les.lesson_no === lessonNo);
            if (lesson) {
                reorderedLessons.push(lesson);
            }
        }

        // Update lesson numbers
        reorderedLessons.forEach((lesson, index) => {
            lesson.lesson_no = index + 1;
        });
        await Promise.all(reorderedLessons.map(lesson => lesson.save()));
        // Save the updated module
        module.lessons = reorderedLessons;
        await module.save();

        res.json({ message: 'Lessons reordered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});





module.exports = router;
