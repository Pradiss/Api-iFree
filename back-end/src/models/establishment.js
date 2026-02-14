const { DataTypes } = require("sequelize");


module.exports = (connectionBank) => {
  const Establishment = connectionBank.define(
    "Establishment",
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
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name is required" 
          },
          len: {
            args: [2, 100],
            msg: "Name must be between 2 and 100 characters"
          }
        }
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "City is required" 
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contact_phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[0-9+\-\s()]+$/, 
            msg: "Invalid phone format"
          }
        }
      }
    },
    {
      tableName: "establishments",
      timestamps: true,
      underscored: true,
    }
  );
  
  return Establishment;
};