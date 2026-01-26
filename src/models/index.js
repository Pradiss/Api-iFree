const connectionBank = require("../config/database");

const User = require("./user")(connectionBank);
const Musician = require("./musician")(connectionBank);
const Band = require("./band")(connectionBank)
const Establishment = require("./establishment")(connectionBank)

User.hasOne(Musician, {
  foreignKey: "user_id",
  as: "musician"
});

Musician.belongsTo(User,{
  foreignKey: "user_id",
  as: "user"
})

User.hasOne(Band, {
  foreignKey: "user_id",
  as: "band"
})

Band.belongsTo(User, {
  foreignKey: "user_id",
  as: "user"
})

User.hasOne(Establishment, {
  foreignKey: "user_id",
  as:"establishment"
})

Establishment.belongsTo(User,{
  foreignKey: "user_id",
  as: "user"
})




module.exports = {
  connectionBank,
  User,
  Musician,
  Band,
  Establishment
};
