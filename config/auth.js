const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");

// Middleware to check if the user is authenticated
function withAuth(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  }
  // If not authenticated, redirect to the login page
  res.redirect("/login");
}

// Route for login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.user_id = user.id; // Save only user ID to the session
      res.redirect("/dashboard");
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route for signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust the salt rounds as needed

    // Create a new user in the database
    await User.create({
      username,
      password: hashedPassword,
    });

    // Redirect to the login page after successful signup
    res.redirect("/login");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  } else {
    res.status(404).end();
  }
});

// Export the router and withAuth middleware
module.exports = { withAuth, router };



