const express = require("express");
const axios = require("axios");
const moment = require("moment-timezone");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://clist.by:443/api/v4/contest/?upcoming=true",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "ApiKey bhargavannaop:83b253f675db5479ac40165b1a9b49d00d5098b4",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch contest data");
    }

    const data = response.data;

    const allowedHosts = [
      "leetcode.com",
      // "hackerrank.com",
      "codeforces.com",
      "codechef.com",
      // "spoj.com",
    ];

    const filtered = data.objects.filter((contest) => {
      return allowedHosts.includes(contest.host);
    });

    const currentDateTime = moment().tz("Asia/Kolkata");

    const currentContests = [];
    const upcomingContests = [];

    filtered.forEach((contest) => {
      const contestStartDateTime = moment.utc(contest.start).tz("Asia/Kolkata");
      const contestEndDateTime = moment.utc(contest.end).tz("Asia/Kolkata");
      if (
        currentDateTime.isBetween(
          contestStartDateTime,
          contestEndDateTime,
          null,
          "[]"
        )
      ) {
        currentContests.push(formatContest(contest));
      } else {
        upcomingContests.push(formatContest(contest));
      }
    });

    currentContests.sort((a, b) => {
      return moment.utc(a.start).diff(moment.utc(b.start));
    });

    upcomingContests.sort((a, b) => {
      return moment.utc(a.start).diff(moment.utc(b.start));
    });

    res.json({
      "Ongoing Contests": currentContests,
      "upcoming Contests": upcomingContests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching contests",
    });
  }
});

// Function to format contest data
function formatContest(contest) {
  // Calculate duration in years, months, days, and hours
  const durationSeconds = contest.duration;
  const years = Math.floor(durationSeconds / (365 * 24 * 3600));
  const months = Math.floor(
    (durationSeconds % (365 * 24 * 3600)) / (30 * 24 * 3600)
  );
  const days = Math.floor((durationSeconds % (30 * 24 * 3600)) / (24 * 3600));
  const hours = Math.floor((durationSeconds % (24 * 3600)) / 3600);

  let formattedDuration = "";
  if (years > 0) {
    formattedDuration += `${years} years `;
  }
  if (months > 0) {
    formattedDuration += `${months} months `;
  }
  if (days > 0) {
    formattedDuration += `${days} days `;
  }
  if (hours > 0) {
    formattedDuration += `${hours} hours`;
  }

  const start = moment
    .utc(contest.start)
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD HH:mm:ss");
  const end = moment
    .utc(contest.end)
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD HH:mm:ss");

  return {
    contest: contest.event,
    host: contest.host,
    duration: formattedDuration.trim(),
    start,
    end,
    href: contest.href,
  };
}

module.exports = router;