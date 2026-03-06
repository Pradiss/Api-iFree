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
const messageRouter = require("./routers/messageRouter")
const app = express()

app.use(cors())
app.use(express.json())

app.use("/v1/uploads", express.static("uploads"))
app.use("/v1/auth", authRouter)
app.use("/v1/band", bandRouter)
app.use("/v1/establishment", establishmentRouter)
app.use("/v1/musician", musicianRouter)
app.use("/v1/genre", genreRouter)
app.use("/v1/instrument", instrumentRouter)
app.use("/v1/media", mediaRouter)
app.use("/v1/availability", availabilityRouter)
app.use("/v1/messages",messageRouter)

module.exports = app

