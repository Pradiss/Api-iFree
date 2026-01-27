const { DataTypes } = require("sequelize")


module.exports = (connectionBank) => {
    const MusicianMedia = connectionBank.define("MusicianMedia", {
        musician_id: {
            type:DataTypes.INTEGER,
            allowNull: false
        },
        type:{
            type: DataTypes.ENUM("image", "video"),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url:{
            type: DataTypes.STRING,
            allowNull: true,
            validate:{
                isUrl: true
            }
        }
    },{
        tableName: "musician_medias",
      
    })

    return MusicianMedia;
}