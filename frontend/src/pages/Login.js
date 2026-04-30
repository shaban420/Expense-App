// src/pages/Login.js — Login page
// User enters email + password, we call the backend, save the token

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

function Login() {
  // useState stores data that can change
  // When state changes, React re-renders the component
  const [email, setEmail] = useState("");       // Stores email input
  const [password, setPassword] = useState(""); // Stores password input
  const [error, setError] = useState("");       // Stores error message
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Used to redirect to another page

  // This function runs when the form is submitted
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    setError("");        // Clear old errors
    setLoading(true);

    try {
      // Call our backend login route
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Tell server we're sending JSON
        body: JSON.stringify({ email, password }), // Convert JS object to JSON string
      });

      // Parse the response JSON
      const data = await response.json();

      // If server returned an error (status not 2xx)
      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      // SUCCESS: Save token and user info to localStorage
      // This way the user stays logged in even after refreshing
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Could not connect to server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>💰 Expense Manager</h2>
        <h3 style={styles.subtitle}>Login</h3>

        {/* Show error message if any */}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin}>
          <div style={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update state on every keystroke
              placeholder="you@email.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.link}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

// Simple inline styles — easy to understand for beginners
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: { textAlign: "center", color: "#2d3748", marginBottom: "5px" },
  subtitle: { textAlign: "center", color: "#4a5568", marginBottom: "20px" },
  field: { marginBottom: "15px" },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #cbd5e0",
    borderRadius: "5px",
    fontSize: "16px",
    marginTop: "5px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4299e1",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: { color: "red", backgroundColor: "#fff5f5", padding: "10px", borderRadius: "5px" },
  link: { textAlign: "center", marginTop: "15px" },
};

export default Login;
