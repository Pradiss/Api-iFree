const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only images are allowed."));
    }
    cb(null, true);
  },
});

exports.uploadMiddleware = upload.single("image");

// exports.uploadImage = async (req, res) => {
//   try {
//     console.log("FILE RECEIVED:", req.file ? {
//       originalname: req.file.originalname,
//       mimetype: req.file.mimetype,
//       size: req.file.size,
//     } : null);

//     if (!req.file) {
//       return res.status(400).json({ error: "No file sent" });
//     }

//     const result = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         {
//           folder: "bandlink/profiles",
//           transformation: [{ width: 400, height: 400, crop: "fill" }],
//         },
//         (error, result) => {
//           if (error) {
//             console.error("Cloudinary error:", error);
//             reject(error);
//           } else {
//             resolve(result);
//           }
//         }
//       );

//       stream.end(req.file.buffer);
//     });

//     return res.status(200).json({
//       url: result.secure_url,
//       public_id: result.public_id,
//     });
//   } catch (error) {
//     console.error("Upload failed:", error);
//     return res.status(500).json({
//       error: "Upload failed",
//       details: error.message,
//     });
//   }
// };

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file sent" });
    }

    const folder = `bandlink/${req.user.role}/profiles`;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      stream.end(req.file.buffer);
    });

    return res.json({
      url: result.secure_url,
      role: req.user.role,
    });
  } catch (error) {
    return res.status(500).json({ error: "Upload failed" });
  }
};
