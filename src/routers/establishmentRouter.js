const express = require("express")
const router = express.Router()

const establishment = require("../controllers/establishmentControllers")
const auth = require("../middlewares/authmiddlewares")
const role = require("../middlewares/rolemiddlewares")

router.post("/",auth, role("establishment"),establishment.register)
router.get("/", establishment.showAll)

module.exports = router; 