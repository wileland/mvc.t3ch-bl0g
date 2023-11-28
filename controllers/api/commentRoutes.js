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
    console.error(err);
    res.status(500).json({ error: "Error posting a comment" });
  }
});

// Get comments for a specific post by post ID
router.get("/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.findAll({
      where: { postId },
    });
    res.json(comments);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a comment by ID
router.delete("/:id", async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Delete the comment from the database
    await comment.destroy();

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
