const { DataTypes } = require("sequelize")

module.exports = (connectionBank) =>{
    const Instrument = connectionBank.define('Instrument', {
        name: {
            type: DataTypes.STRING,
            allowNull:false,
            validate: {
                notEmpty:{                      
                    msg: "Name is Required"
                }
            }
        }
    },{
        tableName: "instruments",
        timestamps: true,
    })
    return Instrument;
}