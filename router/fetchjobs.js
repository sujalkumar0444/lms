const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const queryOptions = {
    keyword: "software engineer",
    location: "India",
    dateSincePosted: "past week",
    jobType: "full time",
    remoteFilter: "remote",
    experienceLevel: "entry level",
    limit: "10",
  };

  class Query {
    constructor(queryObj) {
      this.host = queryObj.host || "www.linkedin.com";
      this.keyword = queryObj.keyword?.trim().replace(/ /g, "+") || "";
      this.location = queryObj.location?.trim().replace(/ /g, "+") || "";
      this.dateSincePosted = queryObj.dateSincePosted || "";
      this.jobType = queryObj.jobType || "";
      this.remoteFilter = queryObj.remoteFilter || "";
      this.salary = queryObj.salary || "";
      this.experienceLevel = queryObj.experienceLevel || "";
      this.sortBy = queryObj.sortBy || "";
      this.limit = Number(queryObj.limit) || 0;
    }

    getDateSincePosted() {
      const dateRange = {
        "past month": "r2592000",
        "past week": "r604800",
        "24hr": "r86400",
      };
      return dateRange[this.dateSincePosted.toLowerCase()] || "";
    }

    getExperienceLevel() {
      const experienceRange = {
        internship: "1",
        "entry level": "2",
        associate: "3",
        senior: "4",
        director: "5",
        executive: "6",
      };
      return experienceRange[this.experienceLevel.toLowerCase()] || "";
    }

    getJobType() {
      const jobTypeRange = {
        "full time": "F",
        "full-time": "F",
        "part time": "P",
        "part-time": "P",
        contract: "C",
        temporary: "T",
        volunteer: "V",
        internship: "I",
      };
      return jobTypeRange[this.jobType.toLowerCase()] || "";
    }

    getRemoteFilter() {
      const remoteFilterRange = {
        "on-site": "1",
        "on site": "1",
        remote: "2",
        hybrid: "3",
      };
      return remoteFilterRange[this.remoteFilter.toLowerCase()] || "";
    }

    getSalary() {
      const salaryRange = {
        40000: "1",
        60000: "2",
        80000: "3",
        100000: "4",
        120000: "5",
      };
      return salaryRange[this.salary] || "";
    }

    url(start) {
      const params = [
        this.keyword && `keywords=${this.keyword}`,
        this.location && `location=${this.location}`,
        this.getDateSincePosted() && `f_TPR=${this.getDateSincePosted()}`,
        this.getSalary() && `f_SB2=${this.getSalary()}`,
        this.getExperienceLevel() && `f_E=${this.getExperienceLevel()}`,
        this.getRemoteFilter() && `f_WT=${this.getRemoteFilter()}`,
        this.getJobType() && `f_JT=${this.getJobType()}`,
        `start=${start}`,
        this.sortBy && `sortBy=${this.sortBy === "recent" ? "DD" : "R"}`,
      ].filter(Boolean).join("&");
      return `https://${this.host}/jobs-guest/jobs/api/seeMoreJobPostings/search?${params}`;
    }

    async getJobs() {
      let allJobs = [];
      let start = 0;
      let jobLimit = this.limit;

      while (true) {
        try {
          const { data } = await axios.get(this.url(start));
          const parsedJobs = parseJobList(data);
          const resultCount = parsedJobs.length;

          if (resultCount === 0) break;

          allJobs.push(...parsedJobs);
          start += 25;

          if (jobLimit !== 0 && allJobs.length >= jobLimit) {
            return allJobs.slice(0, jobLimit);
          }

          // Delay to avoid hitting rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          if (error.response && error.response.status === 429) {
            // Rate limit hit, wait and retry
            console.warn('Rate limit hit, retrying after delay...');
            await new Promise(resolve => setTimeout(resolve, 10000));
          } else {
            console.error(`Error fetching jobs: ${error.message}`);
            throw new Error('Failed to fetch jobs from LinkedIn.');
          }
        }
      }

      return allJobs;
    }
  }

  function parseJobList(jobData) {
    try {
      const $ = cheerio.load(jobData);
      const jobs = $("li");

      const jobObjects = jobs.map((index, element) => {
        const job = $(element);
        return {
          position: job.find(".base-search-card__title").text().trim() || "",
          company: job.find(".base-search-card__subtitle").text().trim() || "",
          location: job.find(".job-search-card__location").text().trim() || "",
          date: job.find("time").attr("datetime") || "",
          salary: job.find(".job-search-card__salary-info").text().trim().replace(/\s+/g, "") || "",
          jobUrl: job.find(".base-card__full-link").attr("href") || "",
          companyLogo: job.find(".artdeco-entity-image").attr("data-delayed-url") || "",
          agoTime: job.find(".job-search-card__listdate").text().trim() || "",
        };
      }).get();

      return jobObjects;
    } catch (error) {
      console.error(`Error parsing job list: ${error.message}`);
      throw new Error('Failed to parse job list from LinkedIn.');
    }
  }

  const query = new Query(queryOptions);

  try {
    const response = await query.getJobs();
    res.json({ totalJobs: response.length, jobs: response });
  } catch (error) {
    console.error("Error fetching jobs from LinkedIn:", error);
    res.status(500).json({ error: "An error occurred while fetching jobs." });
  }
});

module.exports = router;
