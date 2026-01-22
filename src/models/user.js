const { DataTypes } = require("sequelize")
const bcrypt = require("bcryptjs")

module.exports = (connectionBank) => {
    const User = connectionBank.define("User", {
        name: { 
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty:{
                    msg: "Name is required."
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: {
                msg: "Email already registered"
            },
            validate:{
                notEmpty: {
                    msg: " Email is required"
                },
                isEmail: {
                msg: " Email invalid "
                }
            },
            
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:{
                    msg: "Password is required"
                },
                len: {
                    args:[6, 100],
                    msg: "The password must be at least 6 characters long."
                }
            }
        },
        role: {
            type: DataTypes.ENUM('establishment', 'musician', 'band'),
            allowNull: false,
            validate:{
                notEmpty: {
                    msg: "Role is required"
                }
            }
        }
    },{
        tableName: 'users',
        timestamps: true,
        underscored: true
    })

    User.beforeSave(async (user) => {
        if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10)
        }
    })

    return User;
}