const express = require("express");
const { Comment } = require("../../models");
const router = express.Router();

// Post a comment
router.post("/", async (req, res) => {
  try {
    const newComment = await Comment.create({
      content: req.body.content,
      postId: req.body.postId,
      userId: req.body.userId, // Or get user ID from session
    });
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add GET (for fetching comments) and DELETE routes for comments

module.exports = router;
