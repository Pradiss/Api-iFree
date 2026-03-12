const express = require("express");
const router = express.Router();

const bandController = require("../controllers/bandControllers");
const { uploadMiddleware, uploadImage } = require("../controllers/profileImage");

const auth = require("../middlewares/authmiddlewares");
const role = require("../middlewares/rolemiddlewares");

router.post("/", auth, role("band"), bandController.register);


router.get("/", bandController.showAll);

router.post(
  "/upload",
  auth,
  role("band"),
  uploadMiddleware,
  uploadImage
);

module.exports = router;