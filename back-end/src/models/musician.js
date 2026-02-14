const { DataTypes } = require("sequelize");

module.exports = (connectionBank) => {
  const Musician = connectionBank.define(
    "Musician",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      name_artistic: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name artistic is required",
          },
          len: {
            args: [2, 100],
            msg: "Artistic name must be between 2 and 100 characters",
          },
        },
      },

      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      experience_years: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
        },
      },

      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "musicians",
      timestamps: true,
      underscored: true,
    }
  );

  return Musician;
};
