const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize"); // Ensure this path is correct

class Post extends Model {
  // You can define instance methods here if needed
}

Post.init(
  {
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User", // Note: This should match the table name of the User model, check if it's 'users' in your case
        key: "id",
      },
    },
  },
  {
    sequelize, // Use the imported sequelize instance
    modelName: "Post",
    tableName: "posts", // Specify the actual table name if needed
    timestamps: true,
    underscored: true,
  }
);

// Associations can be defined outside the class
Post.associate = function (models) {
  // Example: Post belongs to User
  Post.belongsTo(models.User, { foreignKey: "userId" });
  // Example: Post has many Comments
  // Post.hasMany(models.Comment, { foreignKey: 'postId' });
};

module.exports = Post;
