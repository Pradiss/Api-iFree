require("dotenv").config()

const express = require("express")
const cors = require("cors")
const authRouter = require("./routers/authRouter")
const bandRouter = require("./routers/bandRouter")
const establishmentRouter = require("./routers/establishmentRouter")
const musicianRouter = require("./routers/musicianRouter")
const genreRouter = require("./routers/genreRouter")
const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRouter)
app.use("/band", bandRouter)
app.use("/establishment", establishmentRouter)
app.use("/musician", musicianRouter)
app.use("/genre", genreRouter)

module.exports = app

