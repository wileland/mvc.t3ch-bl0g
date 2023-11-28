const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize"); // Corrected import

class Comment extends Model {}

Comment.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User", // Note: This should match the table name of the User model
        key: "id",
      },
    },
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Post", // Note: This should match the table name of the Post model
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Comment",
    timestamps: true,
    underscored: true,
  }
);

// Associations can be defined outside the class
Comment.associate = function (models) {
  // Define associations here
  // Example: Comment belongs to User
  Comment.belongsTo(models.User, { foreignKey: "userId" });
  // Example: Comment belongs to Post
  Comment.belongsTo(models.Post, { foreignKey: "postId" });
};

module.exports = Comment;
