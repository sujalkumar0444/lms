const express = require("express");
const router = express.Router();
const dashboard = require("../../models/dashboard");

router.get("/",async (req, res) => {
    try
    {
        let roll_no = req.roll_no;
        // console.log(roll_no);
        let dashboard_data=await dashboard.findOne({roll_no});
        // console.log(dashboard_data);
        res.send( {data : dashboard_data.daily_solved_problem_count});
    }
 
    catch (error) {
        console.error("Error fetching daily problems count:", error);
        res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
