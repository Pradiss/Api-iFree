const { DataTypes } = require("sequelize");

module.exports = (connectionBank) => {
  const MusicianGenre = connectionBank.define(
    "MusicianGenre",
    {
      musician_id: {
          type: DataTypes.UUID,
        allowNull: false,
      },
      genre_id: {
          type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "musician_genres",
      timestamps: false,
    }
  );
  return MusicianGenre;
};