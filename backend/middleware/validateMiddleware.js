// middleware/validateMiddleware.js
// This middleware checks if required fields are present in the request
// Prevents bad/incomplete data from reaching our database

// Validate signup/login input
const validateAuth = (req, res, next) => {
  const { email, password } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  // Check if email looks like a real email (basic check)
  if (!email.includes("@")) {
    return res.status(400).json({ message: "Please enter a valid email." });
  }

  // Check if password is provided and at least 6 characters
  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  // All checks passed — continue to route
  next();
};

// Validate expense input
const validateExpense = (req, res, next) => {
  const { title, amount, category } = req.body;

  // Check title
  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Expense title is required." });
  }

  // Check amount is a positive number
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Amount must be a positive number." });
  }

  // Check category is valid
  const validCategories = ["Food", "Transport", "Entertainment", "Shopping", "Health", "Other"];
  if (!category || !validCategories.includes(category)) {
    return res.status(400).json({ message: "Please select a valid category." });
  }

  // All checks passed — continue
  next();
};

module.exports = { validateAuth, validateExpense };
