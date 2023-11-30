const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../../models");
const router = express.Router();

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
}

// User Profile - retrieve the logged-in user's profile
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    req.session.loggedIn = true;
    req.session.user = newUser;

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.session.loggedIn = true;
    req.session.user = user;

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Retrieve a user by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a user by ID
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username;
    user.email = email;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a user by ID
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
