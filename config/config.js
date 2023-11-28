require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: "localhost",
    dialect: "mysql",
  },
  test: {
    // Test environment settings
  },
  production: {
    // Production environment settings
  },
};
