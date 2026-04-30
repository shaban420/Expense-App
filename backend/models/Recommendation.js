// models/Recommendation.js — This defines the "Recommendations" collection
// This is the 3rd collection required for Advanced level

const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    // RELATIONSHIP: This recommendation is for a specific user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Points to User model
      required: true,
    },

    // The advice message to show the user
    // Example: "You spent too much on Food this month!"
    message: {
      type: String,
      required: true,
    },

    // Which category triggered this recommendation
    // Example: "Food" or "Entertainment"
    category: {
      type: String,
      required: true,
    },

    // How severe is this? "warning" or "tip"
    type: {
      type: String,
      enum: ["warning", "tip"],
      default: "tip",
    },

    // The amount spent in this category (stored for reference)
    amountSpent: {
      type: Number,
      required: true,
    },

    // Month this recommendation was generated for
    // Example: "2025-01" for January 2025
    month: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recommendation", recommendationSchema);
