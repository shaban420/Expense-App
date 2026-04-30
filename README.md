# 💰 Expense Manager — Full Stack MERN Application

A full-stack personal finance web application built with the MERN stack. Users can register, log in, and manage their expenses with a live dashboard that summarises spending by category. The backend is secured with JWT authentication and input validation middleware.

> 🌐 **Live Frontend:** [https://expense-app-zktn-5tcz8beg2-shabbys-projects-c8f4513e.vercel.app/login](https://expense-app-zktn-5tcz8beg2-shabbys-projects-c8f4513e.vercel.app/login)
>
> ⚙️ **Live Backend:** [https://expense-app-oxp5.onrender.com](https://expense-app-oxp5.onrender.com)

---

## 📸 Project Overview

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router DOM |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Authentication | JSON Web Tokens (JWT) + bcryptjs |
| Deployment | Render (backend) · Vercel (frontend) |

---

## ✨ Features

- 🔐 **User Authentication** — Secure Signup and Login with JWT tokens
- 🛡️ **Protected Routes** — Unauthenticated users are redirected to Login (both frontend and backend)
- ➕ **Add Expenses** — Title, amount, category, date, and optional note
- 🗑️ **Delete Expenses** — Remove any expense with confirmation
- 📊 **Dashboard Summary** — Total spending breakdown by category using MongoDB aggregation
- 🔍 **Filter by Category** — Instantly filter the expense list by category
- 💡 **Recommendation Engine** — Analyses monthly spending and generates personalised saving tips
- 📱 **Responsive Design** — Works on both mobile and desktop screens
- 🔒 **Input Validation** — All form inputs and API requests are validated server-side

---

## 🗂️ Project Structure

```
expense-app/
├── backend/                        # Node.js + Express API
│   ├── models/
│   │   ├── User.js                 # Users collection schema
│   │   ├── Expense.js              # Expenses collection schema
│   │   └── Recommendation.js       # Recommendations collection schema
│   ├── routes/
│   │   ├── authRoutes.js           # POST /api/auth/signup & /login
│   │   ├── expenseRoutes.js        # GET, POST, DELETE /api/expenses
│   │   └── recommendationRoutes.js # GET, POST /api/recommendations
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   └── validateMiddleware.js   # Input validation
│   ├── server.js                   # Entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/                       # React application
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js                  # Routes + PrivateRoute
        ├── index.js
        └── pages/
            ├── Login.js
            ├── Signup.js
            ├── Dashboard.js
            └── Expenses.js
```

---

## ⚙️ Installation & Local Setup

### Prerequisites

Make sure you have these installed on your machine:

- [Node.js](https://nodejs.org/) v16 or higher
- [npm](https://www.npmjs.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/expense-app.git
cd expense-app
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/expenseDB
JWT_SECRET=your_long_random_secret_key_here
PORT=5000
```

Start the backend server:

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

Test it by visiting: [http://localhost:5000](http://localhost:5000)
You should see: `Expense Management API is running!`

---

### 3️⃣ Frontend Setup

Open a **new terminal window**:

```bash
cd frontend
npm install
```

Create your frontend environment file:

```bash
# Create a .env file in the frontend/ folder
```

Add this line to `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the React app:

```bash
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/expenseDB` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `myRandomSecret123456` |
| `PORT` | Port the server runs on | `5000` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Base URL of the backend API | `http://localhost:5000/api` |



---

## 🛣️ API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT token | ❌ |

**Signup request body:**
```json
{
  "name": "Ali Khan",
  "email": "ali@email.com",
  "password": "secret123"
}
```

**Login request body:**
```json
{
  "email": "ali@email.com",
  "password": "secret123"
}
```

**Response (both):**
```json
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "64abc...", "name": "Ali Khan", "email": "ali@email.com" }
}
```

---

### Expense Routes — `/api/expenses`

> All routes require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/expenses` | Add a new expense |
| `GET` | `/api/expenses` | Get all expenses (optional `?category=Food` filter) |
| `GET` | `/api/expenses/summary` | Get total spending grouped by category (aggregation) |
| `DELETE` | `/api/expenses/:id` | Delete a specific expense |

**Add expense request body:**
```json
{
  "title": "Lunch at café",
  "amount": 850,
  "category": "Food",
  "date": "2025-06-01",
  "note": "Team lunch"
}
```

**Valid categories:** `Food` · `Transport` · `Entertainment` · `Shopping` · `Health` · `Other`

---

### Recommendation Routes — `/api/recommendations`

> All routes require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/recommendations/generate` | Analyse spending and generate tips |
| `GET` | `/api/recommendations` | Get saved recommendations |

---

## 🗄️ Database Schema

### Users Collection
```
_id           ObjectId (auto-generated)
name          String (required)
email         String (unique, required)
password      String (bcrypt hashed)
monthlyBudget Number (default: 0)
createdAt     Date (auto)
```

### Expenses Collection
```
_id      ObjectId
userId   ObjectId → ref: Users   ← relationship
title    String (required)
amount   Number (min: 1)
category Enum [Food, Transport, Entertainment, Shopping, Health, Other]
date     Date
note     String
```

### Recommendations Collection
```
_id         ObjectId
userId      ObjectId → ref: Users   ← relationship
message     String
category    String
type        Enum [warning, tip]
amountSpent Number
month       String (e.g. "2025-06")
```

---

## 🚀 Deployment

### Backend — Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`)
6. Click **Deploy**

✅ **Deployed at:** [https://expense-app-oxp5.onrender.com](https://expense-app-oxp5.onrender.com)



---

## 🔒 Security Measures

- Passwords hashed with **bcryptjs** (salt rounds: 10) — never stored as plain text
- **JWT tokens** signed with a secret key, expire in 7 days
- **Protected routes** on both frontend (PrivateRoute) and backend (authMiddleware)
- **Input validation** middleware rejects malformed requests before they reach the database
- **User data isolation** — all queries filter by `userId` so users cannot access each other's data

---

## 🧠 How the Recommendation Engine Works

1. Fetches all expenses for the current month
2. Groups them by category and sums the amounts
3. Compares each category total against a predefined threshold (e.g. Food: PKR 15,000)
4. If spending **exceeds** the threshold → generates a `warning`
5. If spending is between **80%–100%** of the threshold → generates a `tip`
6. Saves recommendations to MongoDB and displays them on the Dashboard

---

## 📦 Dependencies

### Backend
| Package | Purpose |
|---|---|
| `express` | Web server framework |
| `mongoose` | MongoDB object modelling |
| `jsonwebtoken` | JWT creation and verification |
| `bcryptjs` | Password hashing |
| `cors` | Allow cross-origin requests from frontend |
| `dotenv` | Load environment variables from .env |

### Frontend
| Package | Purpose |
|---|---|
| `react` | UI library |
| `react-router-dom` | Client-side page routing |

---

## 👤 Author

**Your Name** Muhammad Shaban
BS FinTech — FAST NUCES

---

## 📄 License

This project is built for academic purposes as part of the Web Programming course at FAST NUCES.a
