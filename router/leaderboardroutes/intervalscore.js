const express = require("express");
const router = express.Router();
const dashboard = require("../../models/dashboard");

router.get("/", async (req, res) => {
    try {
        const dashboard_data = await dashboard.findOne({ roll_no: req.roll_no });

        if (!dashboard_data) {
            return res.status(404).json({ success: false, message: "Dashboard data not found" });
        }

        const startDate = new Date(req.body.start_date);
        const endDate = new Date(req.body.end_date);
        endDate.setUTCHours(23, 59, 59, 999);

        // Initialize object to store individual data
        const individualData = {
            codechef: 0,
            hackerrank: 0,
            codeforces: 0,
            spoj: 0,
            leetcode: 0
        };

        // Filter daily solved problem entries within the date range
        const problemsInRange = dashboard_data.daily_solved_problem_count.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= startDate && entryDate <= endDate;
        });

        // Calculate total solved problems for each field and update individual data
        const totalProblemsSolved = problemsInRange.reduce((acc, curr) => {
            individualData.codechef += curr.codechef_solved_today;
            individualData.hackerrank += curr.hackerrank_solved_today;
            individualData.codeforces += curr.codeforces_solved_today;
            individualData.spoj += curr.spoj_solved_today;
            individualData.leetcode += curr.leetcode_solved_today;

            return acc +
                curr.codechef_solved_today +
                curr.hackerrank_solved_today +
                curr.codeforces_solved_today +
                curr.spoj_solved_today +
                curr.leetcode_solved_today;
        }, 0);

        // Calculate additional scores
        const ccScore = individualData.codechef * 10;
        const cfScore = individualData.codeforces * 30;
        const hrScore = individualData.hackerrank * 10;
        const spojScore = individualData.spoj * 20;
        const leetScore = individualData.leetcode * 50;

        // Calculate total score
        const totalScore = ccScore + cfScore + hrScore + spojScore + leetScore;

        // Include additional scores and total score in the response
        const responseData = {
            success: true,
            totalProblemsSolved,
            individualData,
            ccScore,
            cfScore,
            hrScore,
            spojScore,
            leetScore,
            totalScore
        };

        res.json(responseData);
    } catch (error) {
        console.error("Error fetching daily problems count:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
