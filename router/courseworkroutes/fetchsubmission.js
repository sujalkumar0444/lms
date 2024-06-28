const router = require('express').Router();
const Submission = require("../../models/submissions");

router.post('/', async (req, res) => {
    try {
        const { problem_id} = req.body;
        console.log("problem_id"+problem_id)
        const roll_no = req.roll_no;
        const submission = await Submission.findOne({ problem_id });
            
        if (!(submission?.users?.length > 0)) {
            return res.status(401).json({ message: 'No submissions found for this problem ID' });
        }
        // console.log(submission)
        console.log(submission.users)
        console.log(roll_no)
        const  usersubmission= submission.users.find(user => user.roll_no == roll_no); 
        if (!usersubmission) {
            return res.status(401).json({ message: 'No submissions found for this user' });
        }

        res.status(200).json({ submissions: usersubmission.submissions });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;