const { DataTypes } = require("sequelize");

module.exports = (connectionBank) => {
  const MusicianInstrument = connectionBank.define(
    "MusicianInstrument",
    {
      musician_id: {
          type: DataTypes.UUID,
        allowNull: false,
      },
      instrument_id: {
          type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "musician_instruments",
      timestamps: false,
    }
  );
  return MusicianInstrument;
};
