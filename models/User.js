const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/sequelize"); // make sure the path is correct

class User extends Model {
  // Instance method to check password validity
  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    // Define attributes like username, email, etc.
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    // Other attributes...
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // ... any other attributes you have
  },
  {
    sequelize, // Pass the sequelize instance
    modelName: "User",
    // ... any other model options
  }
);

// Associations can be defined outside the class
User.associate = function (models) {
  User.hasMany(models.Post, { foreignKey: "userId" });
  User.hasMany(models.Comment, { foreignKey: "userId" });
};

module.exports = User;
