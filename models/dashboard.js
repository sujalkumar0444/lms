const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema({
  roll_no: {
    type: String,
    unique: true,
    required: true,
  },
  user_name: {
    type: String,
    unique: true,
    required: true,
  },
  profile: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
  },
  gender: {
    type: String,
  },
  about_me: {
    type: String,
  },
  building: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  street: {
    type: String,
  },
  postal_code: {
    type: String,
  },
  fb_handle: {
    type: String,
  },
  twitter_handle: {
    type: String,
  },
  insta_handle: {
    type: String,
  },
  linkedin_handle: {
    type: String,
  },
  github: {
    type: String,
  },
  daily_solved_problem_count :
  [{
    date : {type : Date }, 
    codechef_solved_today : {type : Number },
    codechef_total_solved : {type : Number },
    hackerrank_solved_today : {type : Number},
    hackerrank_total_solved : {type : Number},
    codeforces_solved_today : {type : Number},
    codeforces_total_solved : {type : Number},
    spoj_solved_today : {type : Number},
    spoj_total_solved : {type : Number},
    leetcode_solved_today : {type : Number},
    leetcode_total_solved : {type : Number},
  },]
  
});

dashboardSchema.index({ roll_no: 1 });
const dashboard = mongoose.model("dashboard", dashboardSchema);
module.exports = dashboard;
