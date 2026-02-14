const express = require("express")
const router = express.Router()

const instrumentController = require("../controllers/instrumentControllers")

router.post("/", instrumentController.register)
router.get("/", instrumentController.show)
router.delete("/:id", instrumentController.delete)

module.exports = router 