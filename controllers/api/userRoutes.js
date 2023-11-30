const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../../models");
const router = express.Router();

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  }
  res.redirect("/login"); // Redirect to login page if not authenticated
}

// User Profile - retrieve the logged-in user's profile
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id); // Use user_id from session
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

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.user_id = newUser.id; // Save only user ID to the session
      res
        .status(201)
        .json({ message: "Registration successful", user: newUser });
    });
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

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.user_id = user.id; // Save only user ID to the session
      res.json({
        message: "Login successful",
        user: { id: user.id, username: user.username, email: user.email },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// User Logout
router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// Additional routes (retrieve, update, delete) remain unchanged

module.exports = router;
