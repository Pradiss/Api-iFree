require("dotenv").config()

const express = require("express")
const cors = require("cors")
const authRouter = require("./routers/authRouter")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRouter )

module.exports = app

