const express = require("express");
const { Comment } = require("../../models");
const router = express.Router();

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
}

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

// Delete a comment by ID - only authenticated users can delete comments
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await comment.destroy();
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
