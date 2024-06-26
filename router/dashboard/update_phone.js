const express = require("express");
const router = express.Router();

const Dashboard = require("../../models/dashboard");

router.get("/", (req, res) => {
  res.send("Update Phone Number");
});

router.post("/", async (req, res) => {
  try {
    const roll_no = req.roll_no;
    const phone=req.body.phone;

    // Check if the user already exists
    if (!(await Dashboard.exists({ roll_no: roll_no }))) {
      throw new Error("Check you roll number and try again");
    }

    // Update phone number in the Dashboard schema
    await Dashboard.findOneAndUpdate(
      { roll_no: roll_no },
      { phone_number: phone },
      { new: true } // Return the modified document
    );

    res
      .status(200)
      .json({ success: true, message: "Phone Number updated successfully" });
  } catch (error) {
    console.error("Error updating phone number:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
