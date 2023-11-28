const express = require("express");
const { Post } = require("../../models");
const router = express.Router();

function authenticate(req, res, next) {
  // Extract the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Verify the token using the secret key
  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach the decoded user information to the request for future use
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  });
}

module.exports = { authenticate };


// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
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

// Create a new post
router.post("/", async (req, res) => {
  try {
    // Extract post data from the request body
    const { title, content, userId } = req.body;

    // Implement logic to create a new post
    const newPost = await Post.create({
      title,
      content,
      userId,
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating a post" });
  }
});

// Update a post by ID
router.put("/:id", async (req, res) => {
  try {
    // Extract post data from the request body
    const { title, content } = req.body;
    const postId = req.params.id;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update post properties
    post.title = title;
    post.content = content;

    // Save the updated post
    await post.save();

    res.json(post);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a post by ID
router.delete("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete the post from the database
    await post.destroy();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
