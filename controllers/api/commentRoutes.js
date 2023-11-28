const express = require("express");
const { Comment } = require("../../models");
const router = express.Router();


const { Post } = require("../../models");


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
