// src/App.js — Main app file that sets up all routes (pages)
// React Router controls which page to show based on the URL

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import our pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";

// ─────────────────────────────────────────────
// PrivateRoute — Protects pages from logged-out users
// If user is NOT logged in, redirect to /login
// ─────────────────────────────────────────────
function PrivateRoute({ children }) {
  // Check if a token exists in localStorage
  // localStorage is like the browser's memory that stays even after refresh
  const token = localStorage.getItem("token");

  // If no token → send to login page
  // If token exists → show the requested page
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    // BrowserRouter enables client-side routing (no page reloads)
    <BrowserRouter>
      <Routes>
        {/* Public routes — anyone can visit */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes — only logged-in users */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <PrivateRoute>
              <Expenses />
            </PrivateRoute>
          }
        />

        {/* Default: if someone visits /, redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
