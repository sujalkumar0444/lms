const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const user = require("../../models/user");

router.get("/", async (req, res) => {
  res.send("Send an otp to user's email address");
});

async function sendEmail(rollno) {
  
  let user_data = await user.findOne({ roll_no : rollno });
  console.log(user_data);
  if(!user_data)
  {
    return res.status(500).send("Invalid RollNO , No user found");
  }
  const OTP = (Math.floor(100000 + Math.random() * 900000));
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: user_data.email,
      subject: "PASSWORD RECOVERY",
      html: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>DocType - OTP Email Template</title>
  </head>
  <body>
  <!-- partial:index.partial.html -->
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Reset Your Password</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing DocType. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes:</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;"><b>${OTP}</b></h2>
      <p style="font-size:1em;">Regards,<br>DocType</p>
    </div>
  </div>
  <!-- partial -->
    
  </body>
  </html>`,
    };

    transporter.sendMail(mail_configs, function (error) {
      if (error) {
        console.log(error);
        return reject({ message: `Error sending email` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

router.post("/", async (req, res) => {
  const rollno = req.body.rollno;
  // console.log(req.body);
  sendEmail(rollno)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

module.exports = router;
