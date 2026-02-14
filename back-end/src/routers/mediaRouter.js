const express = require("express")
const router = express.Router()
const mediaController = require("../controllers/mediaControllers")
const auth = require("../middlewares/authmiddlewares")

router.post("/", auth, mediaController.create)
router.get("/", mediaController.show)


module.exports = router