// models/Expense.js — This defines the "Expenses" collection in MongoDB

const mongoose = require("mongoose");

// Define the shape of an Expense document
const expenseSchema = new mongoose.Schema(
  {
    // RELATIONSHIP: This expense belongs to a specific user
    // We store the user's _id here — this is called "referencing"
    // Instead of copying all user data, we just store the ID
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Special type for MongoDB IDs
      ref: "User", // Points to the "User" model
      required: true,
    },

    // Title of the expense (e.g. "Pizza", "Bus Ticket")
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Amount in PKR
    amount: {
      type: Number,
      required: true,
      min: 1, // Must be at least 1
    },

    // Category helps us analyze spending patterns
    // The recommendation system uses this field!
    category: {
      type: String,
      required: true,
      // Only these values are allowed
      enum: ["Food", "Transport", "Entertainment", "Shopping", "Health", "Other"],
    },

    // Date the expense happened
    date: {
      type: Date,
      default: Date.now, // If not given, use today
    },

    // Optional note about the expense
    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
