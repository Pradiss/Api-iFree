require("dotenv").config()

const app = require('./server')
const { connectionBank } = require("./models")

const PORT = parseInt(`${process.env.PORT || 3000}`)
connectionBank.sync({ force: true}).then(() => {
    app.listen(PORT, () => 
        console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
})


