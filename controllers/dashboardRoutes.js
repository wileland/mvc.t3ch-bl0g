const express = require("express");
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


// Import the User model (assuming you have a User model)
const { User } = require("../../models");

// Import necessary modules and dependencies

const { authenticate } = require("./auth"); // Import the authenticate middleware

// Define your routes

router.get("/dashboard/profile", authenticate, (req, res) => {
  // This route is protected and requires authentication
  // Access the authenticated user's information
  const user = req.user;

  // Your route logic here...

  res.json({ message: "Protected dashboard route", user });
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
    const user = await User.findByPk(userId);

    if (!user) {
      // Handle the case where the user doesn't exist
      return res.status(404).json({ message: "User not found" });
    }

    // Render a dashboard view with user data
    res.render("dashboard", { user });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
