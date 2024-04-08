const express = require("express");
const router = express.Router();
const multer = require("multer");
const authenticate = require("../../middlewares/is_valid_user");

let uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000 },
});

const uploadcontroller = require("../../controllers/uploadfiles");

router.get("/", (req, res) => {
  res.send("Upload Image");
});

router.post(
  "/",
  uploader.single("file"),
  authenticate,
  uploadcontroller.uploadFile
);

module.exports = router;