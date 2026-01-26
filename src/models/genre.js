const { DataTypes } = require("sequelize")

module.exports = (connectionBank) => {
    const Genre = connectionBank.define("Genre", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty:{
                    msg: "Name is Required"
                }
            }
        }
    },{
        tableName:"genres",
        timestamps: true,

    })
    return Genre
}