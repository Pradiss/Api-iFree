const { DataTypes } = require("sequelize")

module.exports = (connectionBank) => {
    const MusicianSkill = connectionBank.define("MusicianSkill",{
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        musician_id:{
            type:DataTypes.UUID,
            allowNull:false
        },
        skill:{
            type: DataTypes.ENUM('instrumentalist', 'vocalist','dj'),
            allowNull:false,
        }
    })
    return MusicianSkill;
}

