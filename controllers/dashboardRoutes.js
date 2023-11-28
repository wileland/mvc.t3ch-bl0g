const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const models = require("../models"); // Import all models

// Accessing models
const { User, UserAdditionalData } = models; // Include UserAdditionalData here

// Define the authenticate middleware here
function authenticate(req, res, next) {
  // Extract the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Verify the token using the JWT secret key from environment variables
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach the decoded user information to the request for future use
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  });
}

// Import the User model (assuming you have a User model)
const { User } = require("../../models");

// Route for login
router.get("/login", (req, res) => {
  // Check if the user is already authenticated
  if (req.session.loggedIn) {
    // Redirect to the dashboard if the user is logged in
    return res.redirect("/dashboard/profile");
  }

  // Render the login page (create a login.handlebars view)
  res.render("login");
});

// Route for signup
router.get("/signup", (req, res) => {
  // Check if the user is already authenticated
  if (req.session.loggedIn) {
    // Redirect to the dashboard if the user is logged in
    return res.redirect("/dashboard/profile");
  }

  // Render the signup page (create a signup.handlebars view)
  res.render("signup");
});

// Protected route that requires authentication
router.get("/dashboard/profile", authenticate, async (req, res) => {
  try {
    // Access the authenticated user's information
    const user = req.user;

    // Fetch additional user data from the database
    const additionalUserData = await UserAdditionalData.fetchAdditionalUserData(
      user.id
    );

    // Combine user data with additional data
    const userDataWithAdditional = {
      ...user,
      ...additionalUserData,
    };

    // Return the combined data as JSON
    res.json(userDataWithAdditional);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Dashboard route to display user-specific data
router.get("/", async (req, res) => {
  try {
    // Check if the user is authenticated (you can use middleware for this)
    if (!req.session.loggedIn) {
      // Redirect to login page or handle unauthenticated access
      return res.redirect("/login");
    }

    // Retrieve the logged-in user's data (assuming you store user ID in the session)
    const userId = req.session.userId;

    // Use the UserAdditionalData model to get additional user data
    const additionalUserData = await UserAdditionalData.findOne({
      where: { userId }, // Find data associated with the logged-in user
    });

    if (!additionalUserData) {
      // Handle the case where additional user data doesn't exist
      return res
        .status(404)
        .json({ message: "Additional user data not found" });
    }

    // Render a dashboard view with user data and additionalUserData
    res.render("dashboard", { user, additionalUserData });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected route that requires authentication
router.get("/dashboard/profile", authenticate, async (req, res) => {
  try {
    // Access the authenticated user's information
    const user = req.user;

    // Fetch additional user data from the database
    const additionalUserData = await UserAdditionalData.fetchAdditionalUserData(
      user.id
    );

    // Combine user data with additional data
    const userDataWithAdditional = {
      ...user,
      ...additionalUserData,
    };

    // Return the combined data as JSON
    res.json(userDataWithAdditional);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Dashboard route to display user-specific data
router.get("/", async (req, res) => {
  try {
    // ... your existing code ...
  } catch (err) {
    // ... your existing error handling code ...
  }
});

module.exports = router;
