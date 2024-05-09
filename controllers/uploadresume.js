// Updates the profile in the database
const Dashboard = require("../models/dashboard");
const Upload = require("../helpers/upload_files_cloud");

const uploadFile = async (req, res) => {
  const rollno = req.roll_no;
  console.log("Rollno " + rollno);
  try {
    const upload = await Upload.uploadFile(req.file.path);
    // console.log(upload);
    const update_profile = await Dashboard.findOneAndUpdate(
      { roll_no: rollno },
      { resume: upload },
      { new: true }
    );

    // console.log(update_profile);

    if (!update_profile) {
      return res
        .status(404)
        .send({ success: false, msg: "User not found in database" });
    }

    res.send({
      success: true,
      msg: "PDF Uploaded Successfully!",
      data: update_profile.resume,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({ success: false, msg: error.message });
  }
};

module.exports = {
  uploadFile,
};