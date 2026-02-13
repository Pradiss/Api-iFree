const express = require("express")
const router = express.Router()

const availability = require("../controllers/availabilityControllers")
const auth = require("../middlewares/authmiddlewares")
const hasProfile = require("../middlewares/hasProfile");

router.post("/", auth, hasProfile(["musician", "band"]), availability.register);
router.get("/", auth, hasProfile(["musician", "band"]), availability.showAll);


module.exports = router