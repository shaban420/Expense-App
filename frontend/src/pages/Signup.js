// src/pages/Signup.js — Signup page

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed.");
        return;
      }

      // Save token and user info, then go to dashboard
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>💰 Expense Manager</h2>
        <h3 style={styles.subtitle}>Create Account</h3>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSignup}>
          <div style={styles.field}>
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ali Khan"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label>Password (min 6 characters)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

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
    backgroundColor: "#48bb78",
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

export default Signup;
