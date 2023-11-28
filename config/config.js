const config = require("./config");
require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: "localhost",
    dialect: "mysql",
    secretKey: process.env.JWT_SECRET, 

  // Other configuration settings...
};

  },
  test: {
    // Test environment settings
  },
  production: {
    // Production environment settings
  },
};
