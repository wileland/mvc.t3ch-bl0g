import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // MySQL database name from environment variable
  process.env.DB_USER, // MySQL username from environment variable
  process.env.DB_PASS, // MySQL password from environment variable
  {
    host: 'localhost', // MySQL host
    port: process.env.DB_PORT, // MySQL port from environment variable
    dialect: 'mysql', // Specify the dialect as MySQL
    // ... other options ...
  }
);

export default sequelize;
