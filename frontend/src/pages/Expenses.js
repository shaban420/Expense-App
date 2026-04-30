// src/pages/Expenses.js — Expenses page
// User can: Add new expense, Filter by category, Delete an expense

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

function Expenses() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ── State variables ──
  const [expenses, setExpenses] = useState([]);      // List of expenses from backend
  const [total, setTotal] = useState(0);             // Total amount
  const [filterCategory, setFilterCategory] = useState("All"); // Active filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state — one variable per input field
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // List of categories (matches backend enum)
  const categories = ["Food", "Transport", "Entertainment", "Shopping", "Health", "Other"];

  // Fetch expenses when page loads OR when filter changes
  useEffect(() => {
    fetchExpenses();
  }, [filterCategory]); // Re-run whenever filterCategory changes

  // ── Fetch expenses from backend ──
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      // Build URL with optional category filter
      // Example: /api/expenses?category=Food
      const url =
        filterCategory === "All"
          ? `${API}/expenses`
          : `${API}/expenses?category=${filterCategory}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setExpenses(data.expenses);
        setTotal(data.total);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Could not load expenses.");
    } finally {
      setLoading(false);
    }
  };

  // ── Add new expense ──
  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFormLoading(true);

    try {
      const response = await fetch(`${API}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, amount: Number(amount), category, date, note }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      // Show success message
      setSuccess("Expense added successfully!");

      // Clear the form fields
      setTitle("");
      setAmount("");
      setCategory("Food");
      setDate("");
      setNote("");

      // Refresh the expense list
      fetchExpenses();
    } catch (err) {
      setError("Could not add expense.");
    } finally {
      setFormLoading(false);
    }
  };

  // ── Delete an expense ──
  const handleDelete = async (id) => {
    // Ask user to confirm before deleting
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await fetch(`${API}/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Expense deleted.");
        fetchExpenses(); // Refresh list
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Could not delete expense.");
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <span style={styles.navTitle}>💰 Expense Manager</span>
        <div>
          <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        <h2>My Expenses</h2>

        {/* ── ADD EXPENSE FORM ── */}
        <div style={styles.formCard}>
          <h3>Add New Expense</h3>

          {/* Show messages */}
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <form onSubmit={handleAddExpense}>
            {/* Title and Amount in one row */}
            <div style={styles.row}>
              <div style={{ flex: 2 }}>
                <label>Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lunch at café"
                  style={styles.input}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Amount (PKR) *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500"
                  style={styles.input}
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Category and Date in one row */}
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label>Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={styles.input}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            {/* Optional note */}
            <div>
              <label>Note (optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any extra details..."
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.addBtn} disabled={formLoading}>
              {formLoading ? "Adding..." : "+ Add Expense"}
            </button>
          </form>
        </div>

        {/* ── FILTER BY CATEGORY ── */}
        {/* INTERACTIVE FEATURE 1: Filter expenses */}
        <div style={styles.filterSection}>
          <strong>Filter by Category: </strong>
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)} // Change filter state
              style={{
                ...styles.filterBtn,
                backgroundColor: filterCategory === cat ? "#4299e1" : "#e2e8f0",
                color: filterCategory === cat ? "white" : "#4a5568",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Total for current filter */}
        <p style={styles.totalText}>
          Total ({filterCategory}): <strong>PKR {total.toLocaleString()}</strong>
        </p>

        {/* ── EXPENSES LIST ── */}
        {loading ? (
          <p>Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p style={styles.emptyMsg}>No expenses found for this category.</p>
        ) : (
          <div>
            {expenses.map((expense) => (
              <div key={expense._id} style={styles.expenseCard}>
                <div style={styles.expenseLeft}>
                  {/* Category badge */}
                  <span style={{ ...styles.badge, backgroundColor: getCategoryColor(expense.category) }}>
                    {expense.category}
                  </span>
                  <div>
                    <strong>{expense.title}</strong>
                    {expense.note && <p style={styles.note}>{expense.note}</p>}
                    <small style={styles.dateText}>
                      {new Date(expense.date).toLocaleDateString("en-PK", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </small>
                  </div>
                </div>
                <div style={styles.expenseRight}>
                  <span style={styles.amount}>PKR {expense.amount.toLocaleString()}</span>
                  {/* INTERACTIVE FEATURE 2: Delete with confirmation */}
                  <button
                    onClick={() => handleDelete(expense._id)}
                    style={styles.deleteBtn}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function: returns a color for each category
function getCategoryColor(category) {
  const colors = {
    Food: "#fc8181",
    Transport: "#f6ad55",
    Entertainment: "#b794f4",
    Shopping: "#76e4f7",
    Health: "#68d391",
    Other: "#a0aec0",
  };
  return colors[category] || "#a0aec0";
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f7fafc" },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#2d3748",
    color: "white",
    flexWrap: "wrap",
    gap: "10px",
  },
  navTitle: { fontSize: "20px", fontWeight: "bold" },
  navLink: { color: "#90cdf4", marginRight: "15px", textDecoration: "none" },
  logoutBtn: {
    padding: "6px 12px",
    backgroundColor: "#e53e3e",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  content: { padding: "30px", maxWidth: "900px", margin: "0 auto" },
  formCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
    marginBottom: "25px",
  },
  row: { display: "flex", gap: "15px", marginBottom: "10px", flexWrap: "wrap" },
  input: {
    width: "100%",
    padding: "9px",
    border: "1px solid #cbd5e0",
    borderRadius: "5px",
    fontSize: "15px",
    marginTop: "4px",
    boxSizing: "border-box",
  },
  addBtn: {
    marginTop: "15px",
    padding: "10px 25px",
    backgroundColor: "#48bb78",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "15px",
  },
  filterSection: { marginBottom: "15px", display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" },
  filterBtn: {
    padding: "6px 14px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
  },
  totalText: { marginBottom: "15px", fontSize: "16px", color: "#4a5568" },
  emptyMsg: { color: "#718096", textAlign: "center", padding: "30px" },
  expenseCard: {
    backgroundColor: "white",
    padding: "15px 20px",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  expenseLeft: { display: "flex", alignItems: "center", gap: "12px" },
  expenseRight: { display: "flex", alignItems: "center", gap: "15px" },
  badge: {
    padding: "4px 10px",
    borderRadius: "12px",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  amount: { fontWeight: "bold", fontSize: "16px", color: "#2d3748" },
  note: { color: "#718096", fontSize: "13px", margin: "2px 0" },
  dateText: { color: "#a0aec0", fontSize: "12px" },
  deleteBtn: {
    padding: "5px 12px",
    backgroundColor: "#fed7d7",
    color: "#c53030",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "13px",
  },
  error: { color: "red", backgroundColor: "#fff5f5", padding: "10px", borderRadius: "5px", marginBottom: "10px" },
  success: { color: "green", backgroundColor: "#f0fff4", padding: "10px", borderRadius: "5px", marginBottom: "10px" },
};

export default Expenses;
