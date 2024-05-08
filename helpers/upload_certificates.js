const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadFiles = async (filePaths) => {
  // console.log("helper base: ", filePaths);

  if (!filePaths || filePaths.length === 0) {
    throw new Error("No file paths provided");
  }

  const secureUrls = [];

  for (const filePath of filePaths) {
    // console.log(filePath);
    try {
      const result = await cloudinary.uploader.upload(filePath.path, {
        folder: "CodeG/certificates",
        resource_type: "auto",
      });
      secureUrls.push(result.secure_url);
    } catch (error) {
      console.error(`Failed to upload ${filePath.filename}: ${error.message}`);
    }
  }

  if (secureUrls.length === 0) {
    throw new Error("Failed to upload any PDFs to Cloudinary");
  }

  console.log("Successfully uploaded files:", secureUrls);
  return secureUrls;
};

module.exports = {
  uploadFiles,
};