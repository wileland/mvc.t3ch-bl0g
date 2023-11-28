const config = require("./config");

const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../../models");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Define the generateAuthToken function here
function generateAuthToken(user) {
  // Define the payload (data you want to include in the token)
  const payload = {
    userId: user.id,
    username: user.username,
    // Add any additional user-related data as needed
  };

  // Sign the token with the secret key and specify an expiration time
  const token = jwt.sign(payload, config.secretKey, { expiresIn: "1h" });

  return token;
}

const { authenticate } = require("./auth");

// Protected route that requires authentication
router.get("/profile", authenticate, (req, res) => {
  // Access the authenticated user's information
  const user = req.user;

  // Your route logic here...

  res.json({ message: "Protected route", user });
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

// Create a new user
router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Update a user by ID
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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

// User Registration
router.post("/register", async (req, res) => {
  try {
    // Extract user registration data from the request body
    const { username, email, password } = req.body;

    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate an authentication token here (use your own logic)
    const authToken = generateAuthToken(newUser);

    res.status(201).json({ user: newUser, authToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    // Extract user login data from the request body
    const { username, password } = req.body;

    // Find the user by their username or email
    const user = await User.findOne({
      where: { [Op.or]: [{ username }, { email: username }] },
    });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate an authentication token here (use your own logic)
    const authToken = generateAuthToken(user);

    res.json({ user, authToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
