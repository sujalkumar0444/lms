const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
// models
const User = require("../../models/user");

router.get("/", async (req, res) => {
  res.send("Forgot Credentials Page");
});

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User Not Found");
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.secretKey
    ).toString(CryptoJS.enc.Utf8);

    res.send({
      rollno: user.roll_no,
      password: decryptedPassword,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
