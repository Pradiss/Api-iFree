const express = require("express")
const router = express.Router()
const authController = require("../controllers/authControllers")
const auth = require("../middlewares/authmiddlewares")

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/",auth, authController.userAll)
router.delete("/delete", auth, authController.deleteAll)
module.exports = router