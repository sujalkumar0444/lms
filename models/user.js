const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  roll_no: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  codechef_handle: {
    type: String,
    required: true,
    unique: true,
  },
  leetcode_handle: {
    type: String,
    required: true,
    unique: true,
  },
  codeforces_handle: {
    type: String,
    required: true,
    unique: true,
  },
  hackerrank_handle: {
    type: String,
    required: true,
    unique: true,
  },
  spoj_handle: {
    type: String,
    required: true,
    unique: true,
  },
  leaderboard_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Leaderboard",
    required: true,
  },
  credential_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tracked_Scores",
    required: true,
  },
  problems_solved: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProblemsSolvedByStudent",
    required: true,
  },
   enrolled_courses: [String]// Enrolled courses for the user
  }
);

userSchema.index({roll_no: 1});
const Users = mongoose.model("User", userSchema);
module.exports = Users;
