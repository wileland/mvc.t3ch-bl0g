// User.js - Sequelize User Model
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/config");

class User extends Model {}

User.init(
  {
    // Define attributes such as id, username, password
  },
  {
    sequelize,
    // Add hooks for password hashing
  }
);

module.exports = User;
