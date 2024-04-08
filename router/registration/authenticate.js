const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// models
const User = require("../../models/user");

router.get("/", async (req, res) => {
  res.send("Authentication page");
});

router.post("/", async (req, res) => {
  let body = req.body;
  try {
    let roll_no = body.rollno;

    let user = await User.findOne({ roll_no });

    if (!user) {
      throw new Error("User Doesn't exists"); //if user is not preset already
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.secretKey
    ).toString(CryptoJS.enc.Utf8);

    // console.log("Decrypted Password:", decryptedPassword);
    // console.log("Input Password:", body.password);

    const isPasswordMatched = body.password == decryptedPassword;

    if (isPasswordMatched) {
      const payload = { roll_no };
      const jwtToken = jwt.sign(payload, process.env.jwtSecretKey);
      res.json({ jwtToken }); //generates token when the user logins
    } else {
      res.status(400).send("Invalid Password");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

module.exports = router;