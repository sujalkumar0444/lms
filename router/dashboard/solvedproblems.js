const express = require("express");
const router = express.Router();
const SolvedProblems = require("../../models/solved_problems");

router.get("/",async (req, res) => {
    try
    {
        let roll_no = req.roll_no;
        let solvedproblems=await SolvedProblems.findOne({roll_no})
        .populate('codechef_solved.problem')
        .populate('codeforces_solved.problem')
        .populate('hackerrank_solved.problem')
        .populate('spoj_solved.problem');

        if (!solvedproblems) {
            // If student data not found, send an error response
            return res.status(404).json({ message: 'Student data not found' });
        }

        res.send(solvedproblems);
     
      
    }
 
    catch (error) {
        console.error("Error fetching solved problems :", error);
        res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;