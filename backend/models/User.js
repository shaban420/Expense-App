// models/User.js — This defines the "Users" collection in MongoDB
// Think of this as the blueprint for what a user document looks like

const mongoose = require("mongoose");

// Define the shape of a User document
const userSchema = new mongoose.Schema(
  {
    // User's name — must be a string and is required
    name: {
      type: String,
      required: true, // Cannot be empty
      trim: true, // Removes extra spaces
    },

    // User's email — must be unique (no two users with same email)
    email: {
      type: String,
      required: true,
      unique: true, // MongoDB will reject duplicate emails
      lowercase: true, // Always store as lowercase
    },

    // Password — we will store a hashed version (not plain text)
    password: {
      type: String,
      required: true,
    },

    // Monthly budget set by user (default 0 if not set)
    monthlyBudget: {
      type: Number,
      default: 0,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Export this model so other files can use it
module.exports = mongoose.model("User", userSchema);
