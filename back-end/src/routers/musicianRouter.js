const express = require("express");
const router = express.Router();
const musicianController = require("../controllers/musicianControllers");
const auth = require("../middlewares/authmiddlewares");
const role = require("../middlewares/rolemiddlewares");

router.post("/", auth, role("musician"),musicianController.register);
router.get("/profile", auth, role("musician"), musicianController.showProfile);
router.get("/", musicianController.showAll);

module.exports = router;