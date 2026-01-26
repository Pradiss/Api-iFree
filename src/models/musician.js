const { DataTypes } = require("sequelize");

module.exports = (connectionBank) => {
  const Musician = connectionBank.define(
    "Musician",
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
      name_artistic: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name is Required",
          },
          len: {
            args: [2, 100],
            msg: "Artistic name must be between 2 and 100 characters",
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
      experience_years: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Bio is required",
          },
        },
      },
      profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "musicians",
      timestamps: true,
    
    },
  );
  return Musician;
};
