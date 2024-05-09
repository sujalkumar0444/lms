const express = require("express");
const router = express.Router();
const multer = require("multer");
// const authenticate = require("../../middlewares/is_valid_user");
const Dashboard = require("../../models/dashboard");
let uploader = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

const uploadcontroller = require("../../controllers/uploadresume");

router.get("/", async (req, res) => {
  try {
    const user = await Dashboard.findOne({ roll_no: req.roll_no });
    if (!user.resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    }
    res.status(200).json({ success: true, resume: user.resume });
  } catch (error) {
    console.error("Error retrieving resume:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/", uploader.single("file"), uploadcontroller.uploadFile);

module.exports = router;

