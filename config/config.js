const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables from .env file

// Initialize Sequelize with your database configuration
const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost", // MySQL host
  port: process.env.DB_PORT, // MySQL port from environment variable
  username: process.env.DB_USER, // MySQL username from environment variable
  password: process.env.DB_PASS, // MySQL password from environment variable
  database: process.env.DB_NAME, // MySQL database name from environment variable
});

module.exports = sequelize;
