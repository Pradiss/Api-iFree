const { Sequelize } = require('sequelize')

const connectionBank = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,

    define: {
      underscored: true,
      timestamps: true
    }
  }
)

module.exports = connectionBank
