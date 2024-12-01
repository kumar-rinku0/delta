const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const { randomUUID } = require("crypto");

// (async function () {
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/uploads");
//   },
//   filename: function (req, file, cb) {
//     const filename = `${randomUUID()}`;
//     cb(null, filename);
//   },
// });

const multerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "LUMINOUS_DEV",
    allowerdFomats: ["png", "jpg", "jpeg"],
  },
});

// Upload an image
const cloudUpload = (imgPath) => {
  cloudinary.uploader
    .upload(imgPath, {
      public_id: "LUMINOUS",
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log(error);
    });
};

// console.log(uploadResult);

// Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url('shoes', {
//     fetch_format: 'auto',
//     quality: 'auto'
// });

// console.log(optimizeUrl);

// Transform the image: auto-crop to square aspect_ratio
// const autoCropUrl = cloudinary.url('shoes', {
//     crop: 'auto',
//     gravity: 'auto',
//     width: 500,
//     height: 500,
// });

// console.log(autoCropUrl);
// })();

module.exports = {
  cloudUpload,
  multerStorage,
};
