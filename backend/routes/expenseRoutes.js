// routes/expenseRoutes.js
// Handles: GET and POST /api/expenses
// All routes are PROTECTED — must be logged in

const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const { protect } = require("../middleware/authMiddleware");
const { validateExpense } = require("../middleware/validateMiddleware");

// ─────────────────────────────────────────────
// ROUTE 3: POST /api/expenses
// Add a new expense
// Protected: only logged-in users
// ─────────────────────────────────────────────
router.post("/", protect, validateExpense, async (req, res) => {
  try {
    // req.user.id comes from our JWT middleware (set in authMiddleware.js)
    const { title, amount, category, date, note } = req.body;

    // Create expense with the logged-in user's ID
    const expense = await Expense.create({
      userId: req.user.id, // Link this expense to the current user
      title,
      amount,
      category,
      date: date || Date.now(),
      note,
    });

    res.status(201).json({ message: "Expense added!", expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

// ─────────────────────────────────────────────
// ROUTE 4: GET /api/expenses
// Get all expenses for the logged-in user
// QUERY 1: Filter by category (optional)
// QUERY 2: Sort by date (newest first)
// ─────────────────────────────────────────────
router.get("/", protect, async (req, res) => {
  try {
    // req.query.category is the filter from URL: /api/expenses?category=Food
    const { category } = req.query;

    // Build a filter object — always filter by userId
    const filter = { userId: req.user.id };

    // QUERY 1: If category is provided, add it to the filter
    // This is "filtering" — one of the required queries
    if (category && category !== "All") {
      filter.category = category;
    }

    // QUERY 2: Find matching expenses, sort by date descending (newest first)
    // -1 means descending, 1 means ascending
    const expenses = await Expense.find(filter).sort({ date: -1 });

    // Calculate total amount for display
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({ expenses, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

// ─────────────────────────────────────────────
// ROUTE 5: GET /api/expenses/summary
// Get spending summary grouped by category
// This is an AGGREGATION query (required by assignment)
// ─────────────────────────────────────────────
router.get("/summary", protect, async (req, res) => {
  try {
    // MongoDB aggregation pipeline
    // This groups all expenses by category and adds up the amounts
    const summary = await Expense.aggregate([
      // Stage 1: Only look at this user's expenses
      { $match: { userId: require("mongoose").Types.ObjectId.createFromHexString(req.user.id) } },

      // Stage 2: Group by category and sum the amounts
      {
        $group: {
          _id: "$category", // Group by the "category" field
          totalAmount: { $sum: "$amount" }, // Add up all amounts in each group
          count: { $sum: 1 }, // Count how many expenses in each group
        },
      },

      // Stage 3: Sort by total amount (highest first)
      { $sort: { totalAmount: -1 } },
    ]);

    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

// ─────────────────────────────────────────────
// ROUTE 6: DELETE /api/expenses/:id
// Delete a specific expense
// ─────────────────────────────────────────────
router.delete("/:id", protect, async (req, res) => {
  try {
    // Find expense by ID and make sure it belongs to this user
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    await expense.deleteOne();
    res.json({ message: "Expense deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
