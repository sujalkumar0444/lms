const router = require('express').Router();
const { Course, Lesson, Module, Assessments, CourseProblem } = require('../../models/course_work');
const User = require('../../models/user');

router.get('/', async (req, res) => {
    try {
        const user_data = await User.findOne({ roll_no: req.roll_no });
        if (!user_data) {
            // If student data not found, send an error response
            return res.status(404).json({ message: 'Student data not found' });
        }
        const user_courses = user_data.enrolled_courses;
        // Find only the courses that the user is enrolled in
        const courses = await Course.find({ courseid: { $in: user_courses } });
        
        const ret = courses.map(course => ({
            courseid: course.courseid,
            title: course.title,
            coursetags: course.coursetags,
            description: course.description,
            modules_count: course.modules.length
        }));
        
        res.json(ret);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
