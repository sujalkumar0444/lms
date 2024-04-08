const express = require("express");
const router = express.Router();

const User = require("../../models/user");
const Dashboard = require("../../models/dashboard");

router.get("/", (req, res) => {
  res.send("Update Email");
});

router.post("/", async (req, res) => {
  const rollno = req.roll_no;
  try {
    const { email } = req.body;

    // Update email in the User schema
    const updatedUser = await User.findOneAndUpdate(
      { roll_no: rollno },
      { email: email },
      { new: true } // Return the modified document
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    // Update email in the Dashboard schema
    await Dashboard.findOneAndUpdate(
      { roll_no: rollno },
      { email: email },
      { new: true } // Return the modified document
    );

    res
      .status(200)
      .json({ success: true, message: "Phone updated successfully" });
  } catch (error) {
    console.error("Error updating email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
