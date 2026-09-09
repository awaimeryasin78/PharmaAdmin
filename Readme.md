# PharmaAdmin — Pharmacy Management System

A full-stack pharmacy management system built with the MERN stack (MongoDB, Express, React, Node.js). Manage medicine inventory, process sales, track low-stock and expiry alerts, and view analytics — all in one place.

![Tech Stack](https://img.shields.io/badge/MongoDB-Atlas-green) ![Tech Stack](https://img.shields.io/badge/Express.js-Backend-black) ![Tech Stack](https://img.shields.io/badge/React-Frontend-blue) ![Tech Stack](https://img.shields.io/badge/Node.js-Runtime-brightgreen)

---

## Features

- 🔐 **Authentication** — secure login with JWT tokens and hashed passwords
- 📊 **Dashboard** — real-time stats: total medicines, total value, low stock, expiring soon
- 💊 **Inventory Management** — add, edit, delete, search, and filter medicines
- 🛒 **Sales & Billing** — cart-based checkout that automatically deducts stock
- ⚠️ **Alerts** — dedicated page for low-stock and expiring-soon medicines
- 📈 **Reports & Analytics** — sales trends, category breakdown, and top-selling medicines with charts
- 🌗 **Light / Dark Theme** — toggle between themes, preference saved locally
- ⚙️ **Settings** — view account info and app details
- 🎨 **Smooth animations** — powered by Framer Motion throughout the app

---

## Tech Stack

**Frontend:**
- React (Vite)
- React Router
- Framer Motion (animations)
- Chart.js / react-chartjs-2 (charts)
- Axios (API requests)
- Lucide React (icons)
- React Hot Toast (notifications)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT (authentication)
- Bcrypt.js (password hashing)
- CORS + Dotenv

**Database:**
- MongoDB Atlas (cloud-hosted, free tier)

---

## Project Structure

```
PharmaAdmin/
├── Back_End/
│   ├── models/          # Mongoose schemas (Medicine, User, Sale)
│   ├── routes/          # API routes (auth, medicines, sales)
│   ├── middleware/       # JWT auth middleware
│   ├── server.js         # Entry point
│   └── .env              # Environment variables (not committed)
│
└── Front_End/
    ├── src/
    │   ├── api/           # Axios instance
    │   ├── components/    # Sidebar, Topbar, Layout, ThemeToggle
    │   ├── context/        # AuthContext, ThemeContext
    │   ├── pages/          # Login, Dashboard, Inventory, Sales, Alerts, Reports, Settings
    │   ├── App.jsx
    │   └── main.jsx
    └── .env               # Environment variables (not committed)
```

---

## Prerequisites

Before you start, make sure you have these installed on your computer:

| Tool | Purpose | Download Link |
|---|---|---|
| **Node.js** (v18 or later) | Runs JavaScript outside the browser | [nodejs.org](https://nodejs.org) |
| **Git** | Version control | [git-scm.com](https://git-scm.com) |
| **VS Code** (recommended) | Code editor | [code.visualstudio.com](https://code.visualstudio.com) |
| **MongoDB Atlas account** (free) | Cloud database | [mongodb.com/atlas](https://mongodb.com/atlas) |

Check your installations by running these in a terminal:
```bash
node --version
git --version
```

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/awaimeryasin78/PharmaAdmin.git
cd PharmaAdmin
```

### 2. Set up the Backend

```bash
cd Back_End
npm install
```

Create a `.env` file inside `Back_End` with the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_own_secret_key
```

> Get your `MONGODB_URI` from [MongoDB Atlas](https://mongodb.com/atlas) → Database → Connect → Drivers → Node.js. Replace `<db_username>` and `<db_password>` with your database user credentials.

Start the backend server:

```bash
npm run dev
```

The backend will run at `http://localhost:5000`.

### 3. Set up the Frontend

Open a **new terminal window**, then:

```bash
cd Front_End
npm install
```

Create a `.env` file inside `Front_End` with:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will run at `http://localhost:5173`.

### 4. Create your first account

Since the database starts empty, register a user using the app's login page (if a signup flow is enabled) or via the `/api/auth/register` endpoint with a REST client (like Thunder Client or Postman):

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
    "name": "Admin",
    "email": "admin@pharmacy.com",
    "password": "your_password"
}
```

Then log in through the app using those credentials.

---

## Usage

1. **Login** with your account credentials
2. **Dashboard** — view an overview of your pharmacy's stats
3. **Inventory** — click "Add Medicine" to start adding stock
4. **Sales** — search and click medicines to add them to the cart, then complete a sale
5. **Alerts** — monitor low-stock and expiring medicines
6. **Reports** — view sales trends and category breakdowns
7. **Settings** — view your account info and toggle light/dark theme

---

## Environment Variables Reference

**Back_End/.env**
| Variable | Description |
|---|---|
| `PORT` | Port the backend server runs on (default 5000) |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any secret string used to sign login tokens |

**Front_End/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | The URL of your backend API (local or deployed) |

---

## Deployment

This project is designed to deploy for free using:
- **Frontend** → [Vercel](https://vercel.com)
- **Backend** → [Render](https://render.com)
- **Database** → [MongoDB Atlas](https://mongodb.com/atlas)

Push your code to GitHub, then connect the `Back_End` folder to Render and the `Front_End` folder to Vercel. Add the same environment variables in each platform's dashboard settings.

---

## License

This project is open for personal and educational use.
