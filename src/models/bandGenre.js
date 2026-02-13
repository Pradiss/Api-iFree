const { DataTypes } = require("sequelize")

module.exports = (connectionBank) => {
    const BandGenres = connectionBank.define("BandGenres", {
        band_id: {
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        genre_id:{
            type: DataTypes.INTEGER,
            allowNull:false,
        }
    },{
        tableNames: "band_genres",
        timestamps:false,
    })
    return BandGenres;
}