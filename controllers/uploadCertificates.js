const Dashboard = require("../models/dashboard");
const Upload = require("../helpers/upload_certificates");

const uploadFile = async (req, res) => {
  const rollno = req.roll_no;
  console.log("Rollno " + rollno);

  try {
    const upload = await Upload.uploadFiles(req.files); // has secure_urls returned from helper function
    const user = await Dashboard.findOne({ roll_no: rollno });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, msg: "User not found in database" });
    }

    for (const url of upload) {
      user.certificates.push(url);
    }
    await user.save();

    res.send({
      success: true,
      msg: "PDF Uploaded Successfully!",
      data: user.certificates,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, msg: error.message });
  }
};

module.exports = {
  uploadFile,
};