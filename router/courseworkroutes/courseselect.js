const router = require('express').Router();
const User = require('../../models/user');
const { Course }=require("../../models/course_work");
const lessonProgress=require('../../models/course_progress');
const courseleaderboard=require('../../models/course_leaderboard');
router.post('/', async (req, res) => {
    try {
        const user_data = await User.findOne({ roll_no: req.roll_no });
        const courseid = req.body.courseid;
        if (!user_data) {
            // If student data not found, send an error response
            return res.status(404).json({ message: 'Student data not found' });
        }
        const course_data = await Course.findOne({ courseid: courseid });
        if (!course_data) {
            // If student data not found, send an error response
            return res.status(404).json({ message: 'Course not found' });
        }

        if(user_data.enrolled_courses.includes(courseid))
            {
                return res.status(500).json({ message: 'User already enrolled' });
            }
        user_data.enrolled_courses.push(courseid);
        await user_data.save();

          let existingProgress = await lessonProgress.findOne({roll_no: req.roll_no});

          if (!existingProgress) {
            // If no existing progress found, insert a new document
            await lessonProgress.collection.insertOne({
                roll_no: req.roll_no,
                courses: [{
                    courseid: courseid,
                    completed: []
                }]
            });
        }
        else {
            existingProgress.courses.push({
                courseid: courseid,
                completed: []
            })
            await existingProgress.save();
        }
          await courseleaderboard.collection.insertOne({
            user_name: user_data.username,
            graduation_year:user_data.graduation_year, 
            courseid:courseid,
            roll_no:req.roll_no,
            score:0,
          });
          res.json({ message: `Enrolled in ${courseid}`});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
