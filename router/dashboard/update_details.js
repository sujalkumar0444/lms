const express = require("express");
const router = express.Router();

const Dashboard = require("../../models/dashboard");
// const authenticate = require("../../middlewares/is_valid_user");

router.get("/", (req, res) => {
  res.send("Update details page");
});

router.post("/", async (req, res) => {
  const rollno = req.rollno;

  try {
    const updateFields = {
      name: req.body.name,
      email: req.body.email,
      dob: req.body.dob,
      gender: req.body.gender,
      about_me: req.body.about_me,
      building: req.body.building,
      state: req.body.state,
      city: req.body.city,
      street: req.body.street,
      postal_code: req.body.postal_code,
      fb_handle: req.body.fb_handle,
      twitter_handle: req.body.twitter_handle,
      insta_handle: req.body.insta_handle,
      linkedin_handle: req.body.linkedin_handle,
      github: req.body.github,
    };

    // Remove fields with empty strings
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] === "") {
        delete updateFields[key];
      }
    });

    // Check if the user already exists
    const userExists = await Dashboard.exists({ roll_no: rollno });
    if (!userExists) {
      throw new Error("Check your roll number and try again");
    }

    const updatedUser = await Dashboard.findOneAndUpdate(
      { roll_no: rollno },
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found in database");
    }

    res.status(200).json({
      success: true,
      message: "Details updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;