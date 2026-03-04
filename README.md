# 🛍️ Shopify - Full Stack E-Commerce App

A full-stack e-commerce web application built with **React (Vite)** on the frontend and **Node.js + Express + MongoDB** on the backend.

---

## 📁 Project Structure

```
shopify/
├── frontend/       # React + Vite frontend
└── backend/        # Node.js + Express + MongoDB backend
```

---

## 🔗 Source Code

| Part | Folder Link |
|------|-------------|
| 🎨 Frontend | [/frontend](https://github.com/Anandakrishnanvs/Shopify/tree/main/frontend) |
| 🔧 Backend  | [/backend](https://github.com/Anandakrishnanvs/Shopify/tree/main/backend) |

---

## 🚀 Tech Stack

### Frontend
- React 19 + Vite
- React Router DOM
- Context API (Auth & Cart)
- CSS (custom styling)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)

---

## ⚙️ Getting Started

### Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_secret
node server.js
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## ✨ Features

- 🔐 User Authentication (Register / Login / JWT)
- 🛒 Shopping Cart
- 📦 Product Listing & Detail Pages
- 👤 User Profile
- 🔑 Admin Dashboard (Analytics, Products, Users)
- 📱 Responsive Design (Mobile + Desktop)
