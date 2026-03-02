const { Sequelize } = require("sequelize");

const connectionBank = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
  define: {
    underscored: true,
    timestamps: true,
  },
});

module.exports = connectionBank;