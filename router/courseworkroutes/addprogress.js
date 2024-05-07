const router = require('express').Router();
const { Course }=require("../../models/course_work");
const lessonProgress=require('../../models/course_progress');
const courseleaderboard=require('../../models/course_leaderboard');
router.post('/', async (req, res) => {
    try {
        const courseid = req.body.courseid;
        const course_data = await Course.findOne({ courseid: courseid });
        if (!course_data) {
            // If student data not found, send an error response
            return res.status(404).json({ message: 'Course not found' });
        }

        let progress = await lessonProgress.findOne({
            roll_no: req.roll_no,
            courseid:courseid,
          });

          if (progress) {
            progress.completed = req.body.completed;
        let newprogress = await progress.save();

        

        const totalPoints = newprogress.completed.reduce((accumulator, module) => {
            return accumulator + module.lessons.reduce((moduleTotal, lessonItem) => {
                return moduleTotal + lessonItem.points;
            }, 0);
        }, 0);

        let leaderboard = await courseleaderboard.findOne({
            roll_no: req.roll_no,
            courseid:courseid,
          });

          leaderboard.score=totalPoints;
          await leaderboard.save();

            res.json({ message: 'Updated the progress' });
        } else {
            return res.status(500).json({ message: 'User not enrolled in this course' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
