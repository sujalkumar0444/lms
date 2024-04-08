const express = require("express");
const router = express.Router();

const Dashboard = require("../../models/dashboard");

router.get("/", (req, res) => {
  res.send("Update details page");
});

router.post("/", async (req, res) => {
  const rollno = req.roll_no;
  try {
    const {
      name,
      email,
      dob,
      gender,
      about_me,
      building,
      state,
      city,
      street,
      postal_code,
      fb_handle,
      twitter_handle,
      insta_handle,
      linkedin_handle,
      github,
    } = req.body;

    // Check if the user already exists
    if (!(await Dashboard.exists({ roll_no: rollno }))) {
      throw new Error("Check you roll number and try again");
    }

    await Dashboard.findOneAndUpdate(
      { roll_no: rollno },
      {
        name,
        email,
        dob,
        gender,
        about_me,
        building,
        state,
        city,
        street,
        postal_code,
        fb_handle,
        twitter_handle,
        insta_handle,
        linkedin_handle,
        github,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Details updated Sucessfully" });
  } catch (error) {
    console.error("Error updating phone number:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
