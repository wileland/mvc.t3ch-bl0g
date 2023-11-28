const mysql = require("mysql");
require("dotenv").config(); 

const connection = mysql.createConnection({
  host: "localhost", // MySQL host
  user: process.env.DB_USER, // MySQL username from environment variable
  password: process.env.DB_PASS, // MySQL password from environment variable
  database: process.env.DB_NAME, // MySQL database name from environment variable
  port: process.env.DB_PORT, // MySQL port from environment variable
});

module.exports = connection;
