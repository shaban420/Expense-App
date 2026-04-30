// src/index.js — Entry point for React app
// This file mounts the App component into the HTML page

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Find the div with id="root" in public/index.html
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render our App inside it
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
