const router = require('express').Router();
const { Course }=require("../../models/course_work");
const lessonProgress=require('../../models/course_progress');
const courseleaderboard=require('../../models/course_leaderboard');
router.post('/', async (req, res) => {
    try {
        const courseid = req.body.courseid;
        const moduleid=req.body.moduleid;
        const lessonid=req.body.lessonid;
        const lessonpoints=req.body.lessonpoints;


        const course_data = await Course.findOne({ courseid: courseid });
        if (!course_data) {
            // If student data not found, send an error response
            return res.status(404).json({ message: 'Course not found' });
        }

        let progress = await lessonProgress.findOne({
            roll_no: req.roll_no,
          });

          if (progress) {
            
            let courseIndex = progress.courses.findIndex(course => course.courseid === courseid);
            if (courseIndex !== -1) {
       
                let moduleIndex = progress.courses[courseIndex].completed.findIndex(module => module.moduleid === moduleid);
            if (moduleIndex !== -1) {

                let lessonIndex = progress.courses[courseIndex].completed[moduleIndex].lessons.findIndex(lesson => lesson.lessonid === lessonid);
            if (lessonIndex !== -1) {
                return res.status(500).json({ message: 'Already updated' });
            }
            else
            {
                progress.courses[courseIndex].completed[moduleIndex].lessons.push({ lessonid : lessonid });
            
                await progress.save();
            }
            } else {
                progress.courses[courseIndex].completed.push({
                    moduleid: moduleid,
                    lessons: [{ lessonid : lessonid }]
                });
                await progress.save();
            }
            } else {
                return res.status(500).json({ message: 'User not enrolled in the course' });
            }
        let leaderboard = await courseleaderboard.findOne({
            roll_no: req.roll_no,
            courseid:courseid,
          });

          leaderboard.score=leaderboard.score+parseInt(lessonpoints);
          await leaderboard.save();

            res.json({ message: 'Updated the progress' });
        } else {
            return res.status(500).json({ message: 'User not enrolled in any course' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
