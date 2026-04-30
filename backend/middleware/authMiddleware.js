// middleware/authMiddleware.js
// This middleware checks if the user is logged in before allowing access
// It reads the JWT token from the request header and verifies it

const jwt = require("jsonwebtoken");

// This function runs BEFORE protected routes
const protect = (req, res, next) => {
  // Step 1: Get the token from the request header
  // Frontend sends: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  // Step 2: Check if token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // No token found — reject the request
    return res.status(401).json({ message: "Not authorized. Please login." });
  }

  // Step 3: Extract the actual token (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  try {
    // Step 4: Verify the token using our secret key
    // jwt.verify will throw an error if token is fake or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 5: Attach user info to the request object
    // Now req.user is available in any route that uses this middleware
    req.user = decoded;

    // Step 6: Call next() to continue to the actual route
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({ message: "Token is invalid or expired." });
  }
};

module.exports = { protect };
