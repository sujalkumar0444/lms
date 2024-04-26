const express = require("express");
const router = express.Router();
const dashboard = require("../../models/dashboard");

router.get("/",async (req, res) => {
    try
    {
        let roll_no = req.roll_no;
       
         const dashboardData = await dashboard.findOne({roll_no}).select('-daily_solved_problem_count'); 
        res.status(200).send(dashboardData); 
    }
 
    catch (error) {
        console.error("Error fetching dashboard:", error);
        res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
