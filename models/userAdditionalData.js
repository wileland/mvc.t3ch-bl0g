const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Correct the path as needed

const UserAdditionalData = sequelize.define(
  "UserAdditionalData",
  {
    // Example fields (rename these according to actual use case)
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // Add more fields as needed
  },
  {
    timestamps: true, // Add this if you want timestamps (createdAt, updatedAt)
    underscored: true, // Consistent with other model conventions
  }
);

// Associations
UserAdditionalData.associate = (models) => {
  UserAdditionalData.belongsTo(models.User, { foreignKey: "userId" });
};

// Fetch additional user data function
UserAdditionalData.fetchAdditionalUserData = async function (userId) {
  try {
    const additionalUserData = await this.findOne({ where: { userId } });
    if (!additionalUserData) {
      throw new Error("User additional data not found");
    }
    return additionalUserData;
  } catch (error) {
    console.error("Fetch Additional User Data Error:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

module.exports = UserAdditionalData;
