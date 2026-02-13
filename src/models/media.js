const { DataTypes } = require("sequelize")

module.exports = (connectionBank) => {
  const Media = connectionBank.define("Media", {
    user_id: {
        type: DataTypes.UUID,
      allowNull: false
    },
    owner_type: {
      type: DataTypes.ENUM("musician", "band", "establishment"),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("image", "video"),
      allowNull: false
    },
    title: DataTypes.STRING,
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isUrl: true }
    }
  }, {
    tableName: "medias"
  })

  return Media
}

