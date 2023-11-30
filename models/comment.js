const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class Comment extends Model {}

Comment.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Content cannot be empty",
        },
        // Add any other validators you might find necessary
      },
    },
    // Assuming your User and Post models are singular and the tables are pluralized.
    // Sequelize defaults to pluralized version unless you set 'freezeTableName: true' in model options.
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // This should be the table name of the User model
        key: "id",
      },
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "posts", // This should be the table name of the Post model
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
  Comment.belongsTo(models.User, { foreignKey: "userId" });
  Comment.belongsTo(models.Post, { foreignKey: "postId" });
};

module.exports = Comment;
