const express = require("express");
const { Post } = require("../../models");
const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add POST, PUT, DELETE routes for posts

module.exports = router;
