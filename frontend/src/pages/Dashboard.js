// src/pages/Dashboard.js — Main dashboard page
// Shows spending summary by category and recommendations

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

function Dashboard() {
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // State variables
  const [summary, setSummary] = useState([]);          // Spending by category
  const [recommendations, setRecommendations] = useState([]); // Tips from server
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recMessage, setRecMessage] = useState("");

  // useEffect runs once when the component first loads
  // It fetches data from the backend
  useEffect(() => {
    fetchSummary();
    fetchRecommendations();
  }, []); // Empty array = run only once

  // Fetch spending summary grouped by category
  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API}/expenses/summary`, {
        headers: {
          // Send the JWT token so server knows who we are
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
        // Calculate total from all categories
        const total = data.summary.reduce((sum, cat) => sum + cat.totalAmount, 0);
        setTotalExpenses(total);
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved recommendations
  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`${API}/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    }
  };

  // Generate new recommendations based on current expenses
  const generateRecommendations = async () => {
    setRecMessage("Analyzing your spending...");
    try {
      const response = await fetch(`${API}/recommendations/generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setRecMessage(data.message);
      // Refresh the recommendations list
      fetchRecommendations();
    } catch (err) {
      setRecMessage("Error generating recommendations.");
    }
  };

  // Logout: clear localStorage and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  return (
    <div style={styles.page}>
      {/* Navigation bar */}
      <nav style={styles.nav}>
        <span style={styles.navTitle}>💰 Expense Manager</span>
        <div>
          <span style={styles.navUser}>Hello, {user.name}!</span>
          <Link to="/expenses" style={styles.navLink}>Expenses</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        <h2>Dashboard</h2>

        {/* Total spending card */}
        <div style={styles.totalCard}>
          <h3>Total Spent This Month</h3>
          <p style={styles.totalAmount}>PKR {totalExpenses.toLocaleString()}</p>
        </div>

        {/* Spending by category */}
        <h3>Spending by Category</h3>
        {summary.length === 0 ? (
          <p>No expenses yet. <Link to="/expenses">Add your first expense!</Link></p>
        ) : (
          <div style={styles.grid}>
            {summary.map((cat) => (
              <div key={cat._id} style={styles.categoryCard}>
                <h4>{cat._id}</h4>
                <p style={styles.catAmount}>PKR {cat.totalAmount.toLocaleString()}</p>
                <p style={styles.catCount}>{cat.count} expense(s)</p>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations section */}
        <div style={styles.recSection}>
          <h3>Smart Recommendations</h3>
          <button onClick={generateRecommendations} style={styles.generateBtn}>
            🔍 Analyze My Spending
          </button>
          {recMessage && <p style={styles.recMessage}>{recMessage}</p>}

          {recommendations.length === 0 ? (
            <p>Click "Analyze My Spending" to get personalized tips.</p>
          ) : (
            recommendations.map((rec) => (
              <div
                key={rec._id}
                style={{
                  ...styles.recCard,
                  borderLeftColor: rec.type === "warning" ? "#e53e3e" : "#3182ce",
                }}
              >
                <p>{rec.message}</p>
                <small style={styles.recMeta}>Category: {rec.category} • Month: {rec.month}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
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
  navUser: { marginRight: "15px", color: "#a0aec0" },
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
  totalCard: {
    backgroundColor: "#2d3748",
    color: "white",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "25px",
    textAlign: "center",
  },
  totalAmount: { fontSize: "36px", fontWeight: "bold", color: "#68d391" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "15px", marginBottom: "25px" },
  categoryCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  catAmount: { fontSize: "20px", fontWeight: "bold", color: "#4299e1" },
  catCount: { color: "#718096", fontSize: "14px" },
  recSection: { backgroundColor: "white", padding: "25px", borderRadius: "10px", marginTop: "25px" },
  generateBtn: {
    padding: "10px 20px",
    backgroundColor: "#805ad5",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "15px",
    marginBottom: "15px",
  },
  recMessage: { color: "#4a5568", marginBottom: "15px" },
  recCard: {
    padding: "15px",
    borderLeft: "4px solid",
    backgroundColor: "#f7fafc",
    marginBottom: "10px",
    borderRadius: "5px",
  },
  recMeta: { color: "#718096" },
};

export default Dashboard;
