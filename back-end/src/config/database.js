require("dotenv").config();
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

// require("dotenv").config()
// const { Sequelize } = require("sequelize")

// const connectionBank = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: 5432,
//     dialect: "postgres",
//     logging: false,
//     define: {
//       underscored: true,
//       timestamps: true,
//     }
//   }
// )

// module.exports = connectionBank;