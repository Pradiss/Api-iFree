const express = require("express")
const router = express.Router()

const mediaController = require("../controllers/mediaControllers")
const role = require("../middlewares/rolemiddlewares")
const auth = require("../middlewares/authmiddlewares")

router.post("/", auth, role("musician"), mediaController.create)


module.exports = router 