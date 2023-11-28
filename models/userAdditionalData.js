// UserAdditionalData.js

const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); // Import your existing sequelize instance

const UserAdditionalData = sequelize.define("UserAdditionalData", {
  // Define the fields for your additional user data
  field1: {
    type: DataTypes.STRING,
    allowNull: true, // Adjust as needed
  },
  field2: {
    type: DataTypes.INTEGER,
    allowNull: true, // Adjust as needed
  },
  // Add more fields as needed
});

// Define associations if this model is related to the User model
UserAdditionalData.associate = (models) => {
  UserAdditionalData.belongsTo(models.User, { foreignKey: "userId" });
};

// Define the function to fetch additional user data
UserAdditionalData.fetchAdditionalUserData = async function (userId) {
  try {
    // Use Sequelize to query the database and retrieve additional user data
    const additionalUserData = await this.findOne({
      where: { userId }, // Adjust this condition based on your database schema
    });

    return additionalUserData;
  } catch (error) {
    throw new Error("Error fetching additional user data: " + error.message);
  }
};

module.exports = UserAdditionalData;
