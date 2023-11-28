const express = require("express");
const router = express.Router();

// Import the User model (assuming you have a User model)
const { User } = require("../../models");

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
