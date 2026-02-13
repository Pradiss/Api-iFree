const connectionBank = require("../config/database");

const User = require("./user")(connectionBank);
const Musician = require("./musician")(connectionBank);
const Band = require("./band")(connectionBank);
const Establishment = require("./establishment")(connectionBank);
const Genre = require("./genre")(connectionBank);
const Instrument = require("./instrument")(connectionBank);
const Media = require("./media")(connectionBank);
const Availability = require("./availability")(connectionBank);
const BandGenre = require("./bandGenre")(connectionBank);

const MusicianGenre = require("./musicianGenre")(connectionBank);
const MusicianInstrument = require("./musicianInstrument")(connectionBank);

User.hasOne(Musician, { foreignKey: "user_id", as: "musician" });
Musician.belongsTo(User, { foreignKey: "user_id", as: "user" });

User.hasOne(Band, { foreignKey: "user_id", as: "band" });
Band.belongsTo(User, { foreignKey: "user_id", as: "user" });

User.hasOne(Establishment, { foreignKey: "user_id", as: "establishment" });
Establishment.belongsTo(User, { foreignKey: "user_id", as: "user" });

Musician.hasMany(Availability, {
  foreignKey: "musician_id",
  as: "availabilities",
});

Availability.belongsTo(Musician, { foreignKey: "musician_id", as: "musician" });

Band.hasMany(Availability, {
  foreignKey: "band_id",
  as: "availabilities",
});

Availability.belongsTo(Band, {
  foreignKey: "band_id",
  as: "band",
});

Musician.belongsToMany(Genre, {
  through: "musician_genres",
  foreignKey: "musician_id",
  otherKey: "genre_id",
  as: "genres",
});

Genre.belongsToMany(Musician, {
  through: "musician_genres",
  foreignKey: "genre_id",
  otherKey: "musician_id",
  as: "musicians",
});

Musician.belongsToMany(Instrument, {
  through: "musician_instruments",
  foreignKey: "musician_id",
  otherKey: "instrument_id",
  as: "instruments",
});

Instrument.belongsToMany(Musician, {
  through: "musician_instruments",
  foreignKey: "instrument_id",
  otherKey: "musician_id",
  as: "musicians",
});

Band.belongsToMany(Genre, {
  through: "band_genres",
  foreignKey: "band_id",
  otherKey: "genre_id",
  as: "genres",
});
Genre.belongsToMany(Band, {
  through: "band_genres",
  foreignKey: "genre_id",
  otherKey: "band_id",
  as: "bands",
});

User.hasMany(Media, {
  foreignKey: "user_id",
  as: "medias",
});

Media.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

module.exports = {
  connectionBank,
  User,
  Musician,
  Band,
  Establishment,
  Genre,
  Instrument,
  Availability,
  Media,
  BandGenre,
  MusicianGenre,
  MusicianInstrument,
};
