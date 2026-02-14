const express = require("express")
const router = express.Router()
const messageController = require("../controllers/messageControllers")
const auth = require("../middlewares/authmiddlewares")

router.get("/", auth,messageController.messageAll)
router.post("/send", auth,messageController.sendMessage)


module.exports = router

