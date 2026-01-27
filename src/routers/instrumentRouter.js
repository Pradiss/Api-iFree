const express = require("express")
const router = express.Router()

const instrumentController = require("../controllers/instrumentControllers")

router.post("/", instrumentController.register)
router.get("/", instrumentController.show)

module.exports = router 