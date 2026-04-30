// routes/authRoutes.js
// Handles: POST /api/auth/signup and POST /api/auth/login

const express = require("express");
const router = express.Router(); // Create a mini-router for auth routes
const bcrypt = require("bcryptjs"); // For hashing passwords
const jwt = require("jsonwebtoken"); // For creating tokens
const User = require("../models/User"); // Our User model
const { validateAuth } = require("../middleware/validateMiddleware");

// ─────────────────────────────────────────────
// ROUTE 1: POST /api/auth/signup
// Create a new user account
// ─────────────────────────────────────────────
router.post("/signup", validateAuth, async (req, res) => {
  try {
    // Step 1: Get data from request body
    const { name, email, password } = req.body;

    // Step 2: Check if name is provided
    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    // Step 3: Check if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Step 4: Hash the password before saving
    // bcrypt.hash(password, 10) — 10 is "salt rounds" (how strong the hash is)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 5: Create the new user in MongoDB
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // Save hashed version, NOT plain text
    });

    // Step 6: Create a JWT token for the user
    // This token proves the user is logged in
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload (data inside token)
      process.env.JWT_SECRET, // Secret key to sign
      { expiresIn: "7d" } // Token expires in 7 days
    );

    // Step 7: Send back the token and basic user info
    res.status(201).json({
      message: "Account created!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

// ─────────────────────────────────────────────
// ROUTE 2: POST /api/auth/login
// Login with email + password
// ─────────────────────────────────────────────
router.post("/login", validateAuth, async (req, res) => {
  try {
    // Step 1: Get email and password from body
    const { email, password } = req.body;

    // Step 2: Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No account found with this email." });
    }

    // Step 3: Compare entered password with hashed password
    // bcrypt.compare returns true or false
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    // Step 4: Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Step 5: Send token back to frontend
    res.json({
      message: "Login successful!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
