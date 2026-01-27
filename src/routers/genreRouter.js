const express = require("express")
const router = express.Router()

const genreController = require("../controllers/genreControllers")


router.get("/", genreController.showAll)
router.post("/", genreController.register)

module.exports = router 