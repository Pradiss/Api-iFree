const express = require("express")
const router = express.Router()
const authController = require("../controllers/authControllers")
const auth = require("../middlewares/authmiddlewares")

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/", authController.userAll)
router.delete("/delete", authController.deleteAll)
router.get("/me", auth, authController.me)

module.exports = router