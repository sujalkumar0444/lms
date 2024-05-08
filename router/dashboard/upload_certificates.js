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
  limits: {
    filesize: 10485760, //10MB
  },
});

const uploadcontroller = require("../../controllers/uploadCertificates");

router.get("/", async (req, res) => {
  try {
    const user = await Dashboard.findOne({ roll_no: req.rollno });
    if (user.certificates.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: "User has no certificates" });
    }
    res.status(200).json({ success: true, certificates: user.certificates });
  } catch (error) {
    console.error("Error retrieving resume:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/", uploader.array("files", 5), uploadcontroller.uploadFile);

module.exports = router;


