const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// salva na memória em vez de disco
const upload = multer({ storage: multer.memoryStorage() });

exports.uploadMiddleware = upload.single("image");

exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file sent" });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "bandlink/profiles", transformation: [{ width: 400, height: 400, crop: "fill" }] },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    return res.status(200).json({ url: result.secure_url });
  } catch (error) {
    return res.status(500).json({ error: "Upload failed", details: error.message });
  }
};