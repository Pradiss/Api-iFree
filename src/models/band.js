const { DataTypes } = require("sequelize");

module.exports = (connectionBank) => {
  const Band = connectionBank.define(
    "Band",
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
      underscored: true,
    }
  );

  return Band;
};
