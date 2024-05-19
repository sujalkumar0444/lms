const router = require('express').Router();
const Submission = require("../../models/submissions");

router.post('/', async (req, res) => {
    try {
        const { problem_id,submission_time,lang, submission_code, submission_status } = req.body;
        const roll_no=req.roll_no;
        let submission = await Submission.findOne({ problem_id });
    if (!submission) {
      submission = new Submission({ problem_id, users: [] });
    }

    const userIndex = submission.users.findIndex(user => user.roll_no === roll_no);
    if (userIndex === -1) {
      submission.users.push({ roll_no : roll_no,overall_status: (submission_status==='accepted')?'accepted':'pending', submissions: [{ submission_time:submission_time , submission_code: submission_code, lang:lang,
        submission_status: submission_status  }] });
    } else {
      submission.users[userIndex].submissions.unshift({  submission_time:submission_time , submission_code: submission_code, lang:lang,
        submission_status: submission_status  }); 
      submission.users[userIndex].submissions = submission.users[userIndex].submissions.slice(0, 5); 

      if (submission_status === 'accepted' && submission.users[userIndex].overall_status === 'pending') {
        submission.users[userIndex].overall_status = 'accepted';
    }
    }



    await submission.save();
    res.status(201).json({ message: 'Submission added successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;