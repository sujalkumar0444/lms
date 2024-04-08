const express = require("express");
const router = express.Router();
const ProblemsSolvedByStudent = require("../../models/solved_problems");
const Tracked_Scores = require("../../models/tracked_scores");
// const Users=require("../../models/user");

router.get("/", async (req, res) => {
    try {
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        let roll_no = req.roll_no;
        // Convert start_date and end_date strings to Date objects
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        endDate.setHours(23, 59, 59, 999);
        // console.log(startDate,endDate);

        // Query the database
        const studentData = await ProblemsSolvedByStudent.findOne({ roll_no });
        const studentInfo = await Tracked_Scores.findOne({ roll_no});
        // const user = await Users.findOne({ roll_no: req.params.roll_no });
        // let leeetcode=await axios.get(`http://localhost:8800/leetcode/${user.leetcode_handle}`);
        // const lc_data = leeetcode.submissionCalendar;


        if (!studentData || !studentInfo ) {
            // If student data not found, send an error response
            return res.status(404).json({ message: 'Student data not found' });
        }

        // Count solved problems for each section
        const codechefCount = studentData.codechef_solved.filter(item => item.date >= startDate && item.date <= endDate).length;
        const codeforcesCount = studentData.codeforces_solved.filter(item => item.date >= startDate && item.date <= endDate).length;
        const hackerrankCount = studentData.hackerrank_solved.filter(item => item.date >= startDate && item.date <= endDate).length;
        const spojCount = studentData.spoj_solved.filter(item => item.date >= startDate && item.date <= endDate).length;

        const ccScore = studentInfo.cc_rating>1200? ((codechefCount * 10) + (Math.pow(temp - 1200, 2)) / 30):(codechefCount * 10);
        const cfScore = studentInfo.cf_rating>1000? ((codeforcesCount * 30) + (Math.pow(temp - 1200, 2)) / 30):(codeforcesCount * 30);
        const hrScore =  hackerrankCount * 10;
        const spojScore = spojCount * 20;
        // Prepare response
        const response = {
            codechef_count: codechefCount,
            codeforces_count: codeforcesCount,
            hackerrank_count: hackerrankCount,
            spoj_count: spojCount,
            ccScore: ccScore,
            cfScore: cfScore,
            hrScore:hrScore,
            spojScore:spojScore
        };

        // Send response
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;




// const express = require("express");
// const router = express.Router();
// const dashboard = require("../../models/dashboard");

// router.get("/:rollno", async (req, res) => {
//     try {
//         const dashboard_data = await dashboard.findOne({ roll_no: req.params.rollno });

//         if (!dashboard_data) {
//             return res.status(404).json({ success: false, message: "Dashboard data not found" });
//         }

//         const startDate = new Date(req.body.start);
//         const endDate = new Date(req.body.end);

//         // Initialize object to store individual data
//         const individualData = {
//             codechef: 0,
//             hackerrank: 0,
//             codeforces: 0,
//             spoj: 0,
//             leetcode: 0
//         };

//         // Filter daily solved problem entries within the date range
//         const problemsInRange = dashboard_data.daily_solved_problem_count.filter(entry => {
//             const entryDate = new Date(entry.date);
//             return entryDate >= startDate && entryDate <= endDate;
//         });

//         // Calculate total solved problems for each field and update individual data
//         const totalProblemsSolved = problemsInRange.reduce((acc, curr) => {
//             individualData.codechef += curr.codechef_solved_today;
//             individualData.hackerrank += curr.hackerrank_solved_today;
//             individualData.codeforces += curr.codeforces_solved_today;
//             individualData.spoj += curr.spoj_solved_today;
//             individualData.leetcode += curr.leetcode_solved_today;

//             return acc +
//                 curr.codechef_solved_today +
//                 curr.hackerrank_solved_today +
//                 curr.codeforces_solved_today +
//                 curr.spoj_solved_today +
//                 curr.leetcode_solved_today;
//         }, 0);

//         res.json({ success: true, totalProblemsSolved, individualData });
//     } catch (error) {
//         console.error("Error fetching daily problems count:", error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// module.exports = router;
