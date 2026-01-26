const { DataTypes } = require("sequelize");

module.exports = (connectionBank) => {
  const Establishment = connectionBank.define(
    "Establishment",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name is Required",
          },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "City is Required",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contact_phone:{
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: "establishments",
      timestamps: true,
   
    },
  );

  return Establishment;
};
