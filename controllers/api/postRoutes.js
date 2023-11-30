const express = require("express");
const { Post } = require("../../models");
const router = express.Router();

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
}

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific post by ID
router.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new post - only authenticated users can create posts
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.session.user.id; // Assuming userId is stored in session

    const newPost = await Post.create({
      title,
      content,
      userId,
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error creating a post" });
  }
});

// Update a post by ID - only authenticated users can update posts
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const postId = req.params.id;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.title = title;
    post.content = content;
    await post.save();

    res.json(post);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a post by ID - only authenticated users can delete posts
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.destroy();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
