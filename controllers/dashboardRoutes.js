const express = require("express");
const router = express.Router();
const { User, UserAdditionalData } = require("../models");

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  }
  res.redirect("/login");
}

// Route for login
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect("/dashboard/profile");
  }
  res.render("login");
});

// Route for signup
router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect("/dashboard/profile");
  }
  res.render("signup");
});

// Protected route for user profile
router.get("/dashboard/profile", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const additionalUserData = await UserAdditionalData.findOne({
      where: { userId },
    });

    res.render("profile", { user: req.user, additionalUserData });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Dashboard route
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const additionalUserData = await UserAdditionalData.findOne({
      where: { userId },
    });

    res.render("dashboard", { user: req.user, additionalUserData });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
