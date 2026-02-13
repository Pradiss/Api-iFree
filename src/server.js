require("dotenv").config()

const express = require("express")
const cors = require("cors")
const authRouter = require("./routers/authRouter")
const bandRouter = require("./routers/bandRouter")
const establishmentRouter = require("./routers/establishmentRouter")
const musicianRouter = require("./routers/musicianRouter")
const genreRouter = require("./routers/genreRouter")
const instrumentRouter = require("./routers/instrumentRouter")
const mediaRouter = require("./routers/mediaRouter")
const availabilityRouter = require("./routers/availabilityRouter")
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/band", bandRouter)
app.use("/api/establishment", establishmentRouter)
app.use("/api/musician", musicianRouter)
app.use("/api/genre", genreRouter)
app.use("/api/instrument", instrumentRouter)
app.use("/api/media", mediaRouter)
app.use("/api/availability", availabilityRouter)

module.exports = app

