// routes/recommendationRoutes.js
// This is the CORE FINTECH LOGIC of our system
// It analyzes spending and generates smart saving recommendations

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const Recommendation = require("../models/Recommendation");
const { protect } = require("../middleware/authMiddleware");

// ─────────────────────────────────────────────
// THE RECOMMENDATION LOGIC (Helper Function)
// Step-by-step explanation:
// 1. Get this month's expenses for the user
// 2. Group them by category
// 3. Apply rules: if any category exceeds a threshold → create a recommendation
// 4. Save recommendations to MongoDB
// ─────────────────────────────────────────────

// These are our spending thresholds (in PKR)
// If a category exceeds these limits, we warn the user
const THRESHOLDS = {
  Food: 15000,         // If food spending > 15000 PKR, warn
  Transport: 8000,     // If transport > 8000 PKR, warn
  Entertainment: 5000, // If entertainment > 5000 PKR, warn
  Shopping: 10000,     // If shopping > 10000 PKR, warn
  Health: 20000,       // Health can be higher
  Other: 5000,
};

// Tips to show for each category
const TIPS = {
  Food: "Try cooking at home more often to save on food expenses.",
  Transport: "Consider using public transport or carpooling to reduce costs.",
  Entertainment: "Look for free events or use student discounts for entertainment.",
  Shopping: "Make a list before shopping and avoid impulse purchases.",
  Health: "Consider preventive checkups to avoid large health bills.",
  Other: "Review your miscellaneous expenses and see what can be reduced.",
};

// ROUTE 7: POST /api/recommendations/generate
// Generates recommendations based on this month's spending
router.post("/generate", protect, async (req, res) => {
  try {
    // Step 1: Find the current month (e.g. "2025-01")
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // Step 2: Get first and last day of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Step 3: Get this month's expenses for this user
    const expenses = await Expense.find({
      userId: req.user.id,
      date: { $gte: startOfMonth, $lte: endOfMonth }, // Between start and end of month
    });

    // Step 4: Group expenses by category and sum amounts
    // We use a simple JavaScript object as a dictionary
    const spendingByCategory = {};

    expenses.forEach((expense) => {
      // If category not in dictionary, initialize to 0
      if (!spendingByCategory[expense.category]) {
        spendingByCategory[expense.category] = 0;
      }
      // Add this expense's amount to its category total
      spendingByCategory[expense.category] += expense.amount;
    });

    // Step 5: Delete old recommendations for this month (refresh them)
    await Recommendation.deleteMany({ userId: req.user.id, month });

    // Step 6: Check each category against thresholds
    const newRecommendations = [];

    for (const category in spendingByCategory) {
      const amountSpent = spendingByCategory[category];
      const threshold = THRESHOLDS[category] || 5000;

      // If spending exceeds the threshold, create a warning
      if (amountSpent > threshold) {
        const recommendation = await Recommendation.create({
          userId: req.user.id,
          message: `⚠️ You spent PKR ${amountSpent} on ${category} this month! ${TIPS[category]}`,
          category,
          type: "warning",
          amountSpent,
          month,
        });
        newRecommendations.push(recommendation);
      } else if (amountSpent > threshold * 0.8) {
        // If spending is between 80%-100% of threshold → give a "tip" (gentle warning)
        const recommendation = await Recommendation.create({
          userId: req.user.id,
          message: `💡 Tip: You are close to your ${category} limit. PKR ${amountSpent} spent so far. ${TIPS[category]}`,
          category,
          type: "tip",
          amountSpent,
          month,
        });
        newRecommendations.push(recommendation);
      }
    }

    // Step 7: If no issues found, send a positive message
    if (newRecommendations.length === 0) {
      return res.json({
        message: "Great job! Your spending looks healthy this month.",
        recommendations: [],
      });
    }

    res.json({
      message: `${newRecommendations.length} recommendation(s) generated.`,
      recommendations: newRecommendations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

// ROUTE 8: GET /api/recommendations
// Get saved recommendations for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    // Find recommendations for this user, newest first
    const recommendations = await Recommendation.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
