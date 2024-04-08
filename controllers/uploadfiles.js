//Updates the profile in the database
const Dashboard = require("../models/dashboard");
const Upload = require("../helpers/upload_cloud");

const uploadFile = async (req, res) => {
  const roll_no = req.roll_no;
  try {
    const upload = await Upload.uploadFile(req.file.path);
    // console.log(upload);

    const update_image = await Dashboard.findOneAndUpdate(
      { roll_no:roll_no },
      { profile: upload },
      { new: true }
    );

    if (!update_image) {
      return res
        .status(404)
        .send({ success: false, msg: "User not found in database" });
    }

    res.send({
      success: true,
      msg: "File Uploaded Successfully!",
      data: update_image,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({ success: false, msg: error.message });
  }
};

module.exports = {
  uploadFile,
};