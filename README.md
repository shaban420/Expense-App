# 💰 Expense Management System with Recommendation Engine
### FAST NUCES — Web Programming Assignment | BS FinTech Semester 6

---

## 🗂 Project Structure

```
expense-app/
├── backend/                  ← Node.js + Express server
│   ├── models/
│   │   ├── User.js           ← Collection 1: Users
│   │   ├── Expense.js        ← Collection 2: Expenses
│   │   └── Recommendation.js ← Collection 3: Recommendations
│   ├── routes/
│   │   ├── authRoutes.js     ← Login & Signup
│   │   ├── expenseRoutes.js  ← CRUD + Queries
│   │   └── recommendationRoutes.js ← FinTech Logic
│   ├── middleware/
│   │   ├── authMiddleware.js ← JWT Protection
│   │   └── validateMiddleware.js ← Input Validation
│   ├── server.js             ← Main entry point
│   └── package.json
│
└── frontend/                 ← React app
    ├── public/index.html
    └── src/
        ├── App.js            ← Routes setup
        ├── index.js          ← React entry point
        └── pages/
            ├── Login.js      ← Page 1
            ├── Signup.js     ← Page 2
            ├── Dashboard.js  ← Page 3
            └── Expenses.js   ← Page 4
```

---

## ✅ Assignment Requirements Checklist

| Requirement | Status | Where |
|---|---|---|
| Login + Signup pages | ✅ | Login.js, Signup.js |
| Protected routes | ✅ | App.js (PrivateRoute) + authMiddleware.js |
| Token persistence | ✅ | localStorage in Login.js |
| 3 MongoDB Collections | ✅ | User.js, Expense.js, Recommendation.js |
| Relationships (referencing) | ✅ | userId in Expense.js + Recommendation.js |
| CRUD operations | ✅ | POST + GET + DELETE in expenseRoutes.js |
| 2 Queries (filter + aggregation) | ✅ | GET /expenses?category= and /expenses/summary |
| Recommendation System logic | ✅ | recommendationRoutes.js |
| REST API with 3+ routes | ✅ | 8 routes across 3 route files |
| Auth middleware | ✅ | authMiddleware.js |
| Input validation middleware | ✅ | validateMiddleware.js |
| 3+ React pages | ✅ | Login, Signup, Dashboard, Expenses |
| React Router | ✅ | App.js |
| Dynamic data (no hardcoded) | ✅ | All data fetched from backend |
| 2 Security features | ✅ | Input validation + Protected routes |
| Responsive design | ✅ | flexWrap, maxWidth, mobile-friendly styles |
| Filter feature | ✅ | Filter buttons in Expenses.js |
| Show recommendations | ✅ | Dashboard.js recommendations section |

---

## 🚀 STEP-BY-STEP SETUP (Run Locally First)

### Step 1: Set up MongoDB Atlas (Free Cloud Database)

1. Go to https://www.mongodb.com/atlas and sign up for free
2. Create a new **free** cluster (M0)
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string — it looks like:
   `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`
5. Add your database name at the end: `...mongodb.net/expenseDB`

### Step 2: Set up the Backend

```bash
# Go into the backend folder
cd expense-app/backend

# Install all packages
npm install

# Create the .env file (copy from example)
cp .env.example .env

# Now open .env and fill in:
# MONGO_URI=your MongoDB Atlas connection string
# JWT_SECRET=any long random string like "mySecret123456"
# PORT=5000

# Start the backend
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### Step 3: Set up the Frontend

```bash
# Open a NEW terminal window
cd expense-app/frontend

# Install all packages
npm install

# Start React app
npm start
```

The app opens at http://localhost:3000

---

## 🌐 DEPLOYMENT GUIDE

### Step 1: Deploy Backend on Render (Free)

1. Push your code to GitHub (create a repo)
2. Go to https://render.com and sign up
3. Click **"New Web Service"** → Connect your GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = your secret key
   - `PORT` = 5000
6. Click **Deploy** — you get a URL like `https://expense-backend.onrender.com`

### Step 2: Deploy Frontend on Vercel (Free)

1. Go to https://vercel.com and sign up
2. Import your GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework**: Create React App
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://expense-backend.onrender.com/api`
5. Click **Deploy** — you get a URL like `https://expense-app.vercel.app`

---

## 📖 VIVA PREPARATION — Explain Every Line

### Q: What is JWT and why do we use it?
JWT = JSON Web Token. When a user logs in, the server creates a token using a secret key. The token is saved in the browser (localStorage). Every time the user makes a request, the token is sent in the header. The server checks the token to verify the user is logged in. It's like a stamped ticket — you get it at login and show it at every protected door.

### Q: Why use referencing instead of embedding?
We store `userId` (just the ID) in the Expense document instead of copying all user data. This is called **referencing**. If the user changes their name, we don't need to update thousands of expense documents. It's more efficient and avoids data duplication.

### Q: How does the Recommendation System work?
1. Get all expenses for this user in the current month
2. Group them by category and add up amounts
3. Compare each category total to our threshold (e.g., Food > PKR 15,000)
4. If threshold is exceeded → create a "warning" recommendation
5. If between 80%–100% of threshold → create a "tip" recommendation
6. Save recommendations to MongoDB and return them to the frontend

### Q: What is the aggregation query?
```javascript
Expense.aggregate([
  { $match: { userId: ... } },     // Filter by this user
  { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } }, // Sum by category
  { $sort: { totalAmount: -1 } }   // Sort highest first
])
```
This groups all expenses by category and sums the amounts — like a SQL GROUP BY.

### Q: What is middleware?
Middleware is a function that runs BETWEEN the request and the route handler. Like a security guard at a door. Our `protect` middleware checks the JWT token. If valid, it passes to the route. If not, it rejects with 401.

### Q: Name a security vulnerability in your code
The JWT_SECRET is stored in the `.env` file. If this file is accidentally committed to GitHub, attackers can forge tokens. Fix: add `.env` to `.gitignore` and use strong random secrets in production.

---

## 🗄 Database Schema Diagram

```
Users Collection
─────────────────────────────
_id         ObjectId (auto)
name        String
email       String (unique)
password    String (hashed)
monthlyBudget Number
createdAt   Date

        │ (one user has many expenses)
        ↓

Expenses Collection
─────────────────────────────
_id         ObjectId (auto)
userId      ObjectId → ref: User  ← RELATIONSHIP
title       String
amount      Number
category    String (enum)
date        Date
note        String

        │ (one user has many recommendations)
        ↓

Recommendations Collection
─────────────────────────────
_id         ObjectId (auto)
userId      ObjectId → ref: User  ← RELATIONSHIP
message     String
category    String
type        String (warning/tip)
amountSpent Number
month       String (e.g. "2025-01")
```
