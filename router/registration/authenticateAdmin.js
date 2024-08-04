const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {ADMIN_NAME, ADMIN_PASSWORD} =require( "../../config");

// models

router.get("/",(req,res)=>{
  res.send("helloadmin");
})
router.post("/", async (req, res) => {
  let body = req.body;
  try {
    let roll_no = body.rollno;
    let password = body.password;
    if(roll_no == ADMIN_NAME && password == ADMIN_PASSWORD) {
      const token = jwt.sign({adminname: roll_no}, process.env.jwtSecretKey, {expiresIn: "6hr"});
      res.status(200).json({token: token});
    }
    else{
        res.status(401).json({data: "Invalid Credentials"});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

module.exports = router;