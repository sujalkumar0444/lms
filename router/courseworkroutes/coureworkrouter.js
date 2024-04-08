const router = require('express').Router();
const { Lesson, CourseProblem, Assessments, Module, Course } = require("../../models/course_work");

// Endpoint to add content
router.post('/content', async (req, res) => {
    try {
        const current_module = await Module.findById(req.body.module_id);
        let newLesson = await Lesson.create({
            lesson_no: (current_module.lessons.length || 0) + 1,
            contentype: 'text-material',
            lesson_title: req.body.lesson_title,
            lesson_points: 0,
            text_content: req.body.text_content,
        });

        await newLesson.save();

        current_module.lessons.push(newLesson._id);

        await current_module.save();

        res.send("added content");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Endpoint to add a problem
router.post('/problem', async (req, res) => {
    try {
        const current_module = await Module.findById(req.body.module_id);
        let problems_data = await CourseProblem.create({
            problem_title: req.body.problem_title,
            problem_description: req.body.problem_description,
            sample_test_cases: req.body.sample_test_cases,
            hidden_test_cases: req.body.hidden_test_cases
        });

        await problems_data.save();

        let newLesson = await Lesson.create({
            lesson_no: (current_module.lessons.length || 0) + 1,
            contentype: 'problem',
            lesson_title: req.body.lesson_title,
            lesson_points: req.body.problem_points,
            problem_id: problems_data._id
        });

        await newLesson.save();

        current_module.module_total_score = current_module.module_total_score + req.body.problem_points;
        current_module.lessons.push(newLesson._id);

        await current_module.save();

        res.send("added problem");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Endpoint to add a course
router.post('/course', async (req, res) => {
    try {
        let new_course = await Course.create({
            courseid: req.body.course_id,
            course_tags: req.body.course_tags,
            title: req.body.title,
            description: req.body.description,
            modules: []
        });

        await new_course.save();

        res.send({ "course_object_id": new_course._id });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Endpoint to add a module
router.post('/module', async (req, res) => {
    try {
        const current_course = await Course.findOne({ courseid: req.body.course_id });

        let newModule = await Module.create({
            module_title: req.body.module_title,
            module_no: (current_course.modules.length || 0) + 1,
            module_total_score: 0,
            lessons: []
        });

        await newModule.save();

        current_course.modules.push(newModule._id);

        await current_course.save();

        res.send({ "module_id": newModule._id });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Endpoint to add an assessment
router.post('/assessment', async (req, res) => {
    try {
        if (req.body.assessment_id) {
            const current_module = await Module.findById(req.body.module_id);
            let problems_data = await CourseProblem.create({
                problem_title: req.body.problem_title,
                problem_description: req.body.problem_description,
                sample_test_cases: req.body.sample_test_cases,
                hidden_test_cases: req.body.hidden_test_cases
            });

            await problems_data.save();

            const current_assessment = await Assessments.findById(req.body.assessment_id);

            current_assessment.problems.push({
                problem_ref: problems_data._id,
                points: req.body.problem_points
            });

            await current_assessment.save();

            const current_lesson = await Lesson.findById(req.body.lesson_id);
            current_lesson.lesson_points = current_lesson.lesson_points + req.body.problem_points;
            await current_lesson.save();

            current_module.module_total_score = current_module.module_total_score + req.body.problem_points;

            await current_module.save();

            res.send({
                "lesson_id": current_lesson._id,
                "assessment_id": current_assessment._id
            });
        } else {
            const current_module = await Module.findById(req.body.module_id);

            let problems_data = await CourseProblem.create({
                problem_title: req.body.problem_title,
                problem_description: req.body.problem_description,
                sample_test_cases: req.body.sample_test_cases,
                hidden_test_cases: req.body.hidden_test_cases
            });

            await problems_data.save();

            let new_assessment = await Assessments.create({
                assignment_name: req.body.assignment_name,
                total_time: req.body.total_time,
                problems: [{
                    problem_ref: problems_data._id,
                    points: req.body.problem_points
                }]
            });
            await new_assessment.save();

            let newLesson = await Lesson.create({
                lesson_no: (current_module.lessons.length || 0) + 1,
                contentype: 'assessment',
                lesson_title: req.body.lesson_title,
                lesson_points: req.body.problem_points,
                assessment_ref: new_assessment._id
            });
            await newLesson.save();

            current_module.lessons.push(newLesson._id);
            current_module.module_total_score = current_module.module_total_score + req.body.problem_points;
            await current_module.save();

            res.send({
                "lesson_id": newLesson._id,
                "assessment_id": new_assessment._id
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;
