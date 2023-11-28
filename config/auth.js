const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("./config");
const { User } = require("../models"); // Assuming you have a User model
const bcrypt = require("bcrypt");

// Import the authentication middleware
const { authenticate } = require("./authentication");

// Route for login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If the credentials are valid, create a JWT token
    const token = jwt.sign({ id: user.id }, config.secretKey, {
      expiresIn: "1h", // Token expires in 1 hour (adjust as needed)
    });

    // Send the token in the response
    res.json({ token });
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
    const hashedPassword = await bcrypt.hash(password, 10); // You can adjust the salt rounds

    // Create a new user in the database
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    // If user creation is successful, create a JWT token
    const token = jwt.sign({ id: newUser.id }, config.secretKey, {
      expiresIn: "1h", // Token expires in 1 hour (adjust as needed)
    });

    // Send the token in the response
    res.json({ token });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
