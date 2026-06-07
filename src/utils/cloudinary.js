import { v2 as cloudinary } from "cloudinary"; // v2 laana hi syntax hai
import fs from "fs"; // we dont need to install ,comes ny default with node
//(read, write any opr related to file done with help of this)

// Configuration for cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET, // Click 'View API Keys' above to copy your API secret
});

// fn to upload file on cloudinary

const uploadOnCloudinary = async () => {
  try {
    if (!localFilePath) return null;

    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // uploaded Successfully
    console.log("file uploaded", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // it will remove locally saved temp file as upload oprt get failed
    return null;
  }
};

export {uploadOnCloudinary}
