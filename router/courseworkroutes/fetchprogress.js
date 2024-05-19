const router = require('express').Router();
const { Course }=require("../../models/course_work");
const lessonProgress=require('../../models/course_progress');
router.get('/:courseid', async (req, res) => {
    try {
        const courseid = req.params.courseid;
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
       
                res.json({ progress: progress.courses[courseIndex].completed });
            
            } 
             else {
                return res.status(500).json({ message: 'User not enrolled in the course' });
            }
  
        } else {
            return res.status(500).json({ message: 'User not enrolled in any course' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
