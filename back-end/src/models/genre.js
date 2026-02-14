const { DataTypes } = require("sequelize");

module.exports = (connectionBank) => {
  const Genre = connectionBank.define(
    "Genre",
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
      tableName: "genres",
      timestamps: true,
      underscored: true,
    }
  );

  return Genre;
};
