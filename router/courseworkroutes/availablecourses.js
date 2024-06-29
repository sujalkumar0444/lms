const router = require('express').Router();

let { Course } = require('../../models/course_work');
let users = require('../../models/user');

router.get('/', async (req, res) => {
    try {
        let courses = await Course.find({});
        let roll_no = req.roll_no;
        let user = await users.findOne({ roll_no: roll_no });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let user_already_enrolled = user.enrolled_courses;
        let ret = [];
        for (let course of courses) {
            if (user_already_enrolled.includes(course.courseid)) {
                continue;
            }
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

module.exports = router;