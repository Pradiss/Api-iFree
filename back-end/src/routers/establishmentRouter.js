const express = require("express");
const router = express.Router();

const establishmentController = require("../controllers/establishmentControllers");
const { uploadMiddleware, uploadImage } = require("../controllers/profileImage");

const auth = require("../middlewares/authmiddlewares");
const role = require("../middlewares/rolemiddlewares");

router.post("/", auth, role("establishment"), establishmentController.register);

// router.get("/profile", auth, role("establishment"), establishmentController.showProfile);

router.get("/", establishmentController.showAll);

router.post(
  "/upload",
  auth,
  role("establishment"),
  uploadMiddleware,
  uploadImage
);

module.exports = router;