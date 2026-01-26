const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Band = sequelize.define(
    "Band",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      genre_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true },
      },
    },
    {
        tableName: "bands",
        timestamps: true,
        
    }
  );

  return Band;
};
