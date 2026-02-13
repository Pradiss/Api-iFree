const { DataTypes } = require("sequelize");

module.exports = (connectionBank) => {
  const Instrument = connectionBank.define(
    "Instrument",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Name is Required",
          },
        },
      },
    },
    {
      tableName: "instruments",
      timestamps: true,
      underscored: true,
    }
  );

  return Instrument;
};
