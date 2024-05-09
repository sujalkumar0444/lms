const express = require("express");
const router = express.Router();
const multer = require("multer");
// const authenticate = require("../../middlewares/is_valid_user");

let uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 1000000 }, // 1 MB in bytes
});

const uploadcontroller = require("../../controllers/uploadimage");
const Dashboard = require("../../models/dashboard");
router.get("/", async (req, res) => {
  try {
    const user = await Dashboard.findOne({ roll_no: req.roll_no });
    if (!user.profile) {
      return res
        .status(404)
        .json({ status: false, message: "Profile not found" });
    }
    res.json({ status: true, profile: user.profile });
  } catch (error) {}
});

router.post("/", uploader.single("file"), uploadcontroller.uploadFile);

module.exports = router;