const connectionBank = require("../config/database");

const User = require("./user")(connectionBank);
const Musician = require("./musician")(connectionBank);
const Band = require("./band")(connectionBank)
const Establishment = require("./establishment")(connectionBank)
const Genre = require("./genre")(connectionBank)
const Instrument = require("./instrument")(connectionBank)
const MusicianMedia = require("./musicianMedia")(connectionBank)

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

Musician.hasMany(MusicianMedia, {
  foreignKey: 'musician_id',
  as:"media"
})

MusicianMedia.belongsTo(Musician, {
  foreignKey: "musician_id",
  as:"musician"
})

Musician.belongsToMany(Genre, {
  through: "musician_genres",  // nome da tabela pivot
  foreignKey: "musician_id",
  otherKey: "genre_id",
  as: "genres"
});

Genre.belongsToMany(Musician, {
  through: "musician_genres",
  foreignKey: "genre_id",
  otherKey: "musician_id",
  as: "musicians"
});

Musician.belongsToMany(Instrument, {
  through: "musician_instruments", 
  foreignKey: "musician_id",
  otherKey: "instrument_id",
  as: "instruments"
});

Instrument.belongsToMany(Musician, {
  through: "musician_instruments",
  foreignKey: "instrument_id",
  otherKey: "musician_id",
  as: "musicians"
});

module.exports = {
  connectionBank,
  User,
  Musician,
  Band,
  Establishment,
  Genre,
  Instrument,
  MusicianMedia
};