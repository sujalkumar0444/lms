const router = require('express').Router();
const Submission = require("../../models/submissions");

router.get('/:problem_id', async (req, res) => {
    try {
        const { problem_id} = req.params;
        const roll_no = req.roll_no;
        const submission = await Submission.findOne({ problem_id });

        if (!submission) {
            return res.status(404).json({ message: 'No submissions found for this problem ID' });
        }

        const user = submission.users.find(user => user.roll_no === roll_no);

        if (!user) {
            return res.status(404).json({ message: 'No submissions found for this user' });
        }

        res.status(200).json({ submissions: user.submissions });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;