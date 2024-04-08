const express = require("express");
const router = express.Router();
const linkedIn = require("linkedin-jobs-api");

router.get("/", (req, res) => {
  const queryOptions = {
    keyword: "software engineer",
    location: "India",
    dateSincePosted: "past Week",
    jobType: "full time",
    remoteFilter: "remote",
    // salary: "100000",
    experienceLevel: "entry level",
    limit: "20",
  };
  //takes 6secs to retrieve data if limit is 50
  //takes 3secs to retrieve data if limit is 20

  linkedIn.query(queryOptions).then((response) => {
    res.json(response);
    console.log(response.length);
  });
});

module.exports = router;