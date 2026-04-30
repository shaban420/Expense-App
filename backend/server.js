// server.js — This is the main file that starts our backend server

// Load environment variables from .env file
require("dotenv").config();

// Import express (our web server library)
const express = require("express");

// Import cors — allows our React frontend to talk to this backend
const cors = require("cors");

// Import mongoose — helps us talk to MongoDB
const mongoose = require("mongoose");

// Import our route files (we will create these soon)
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

// Create the express app
const app = express();

// MIDDLEWARE 1: Allow JSON data in requests
// This lets us read req.body when someone sends JSON
app.use(express.json());

// MIDDLEWARE 2: Allow React (on different port) to call this server
app.use(cors());

// Connect to MongoDB Atlas using the URI from .env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ROUTES — Tell express which file handles which URL
// Any request starting with /api/auth → goes to authRoutes.js
app.use("/api/auth", authRoutes);

// Any request starting with /api/expenses → goes to expenseRoutes.js
app.use("/api/expenses", expenseRoutes);

// Any request starting with /api/recommendations → goes to recommendationRoutes.js
app.use("/api/recommendations", recommendationRoutes);

// A simple test route to check if server is running
app.get("/", (req, res) => {
  res.send("Expense Management API is running!");
});

// Start the server on port from .env (or 5000 if not set)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
