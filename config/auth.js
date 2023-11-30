const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // If not authenticated, redirect to the login page
  res.redirect("/login");
}

// Route for login
router.post("/login", passport.authenticate("local"), (req, res) => {
  // After successful authentication, redirect to the desired page
  res.redirect("/dashboard");
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

// Export the router and isAuthenticated middleware
module.exports = { isAuthenticated, router };
