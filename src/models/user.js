const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (connectionBank) => {
  const User = connectionBank.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name is required.",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Email is required",
          },
          isEmail: {
            msg: "Email invalid",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password is required",
          },
          len: {
            args: [8, 100],
            msg: "The password must be at least 6 characters long.",
          },
          isStrong(value) {
            if (!/[A-Z]/.test(value)) {
              throw new Error("Password must contain at least one uppercase letter.");
            }
            if (!/[0-9]/.test(value)) {
              throw new Error("Password must contain at least one number.");
            }
          }
        },
      },
      role: {
        type: DataTypes.ENUM("establishment", "musician", "band"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["establishment", "musician", "band"]],
            msg: "Invalid role",
          },
        },
      },
    },
    {
      tableName: "users",
      timestamps: true,
      paranoid: true,
    },
  );

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

   User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });


  return User;
};
