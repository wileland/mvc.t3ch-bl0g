const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../../models");
const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// User Login
router.post("/login", async (req, res) => {
  // Implement login logic
});

// Add more routes as needed (e.g., user profile update, logout)

module.exports = router;
