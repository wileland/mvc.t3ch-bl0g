const sequelize = require("../config/sequelize");

// Import models directly without invoking them as functions
const User = require("./user");
const Post = require("./post");
const Comment = require("./comment");

// Setup associations
// Make sure these associate methods are defined in your model files
User.associate({ Post, Comment });
Post.associate({ User, Comment });
Comment.associate({ User, Post });

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
};
