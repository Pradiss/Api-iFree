const connectionBank = require("../config/database")

const User = require("./user")(connectionBank)




module.exports = {
  connectionBank,
  User
}
