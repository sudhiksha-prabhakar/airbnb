# 🏠 Airbnb Clone - Full Stack MERN Application

A full-stack Airbnb clone built using MongoDB Atlas, Express, React, and Node.js with responsive UI, property search, guest filtering, authentication, host property management, and booking workflows.

---

## 🌐 Live Demos

- **Frontend (Vercel)**: [https://airbnb-cyan-gamma.vercel.app](https://airbnb-cyan-gamma.vercel.app)
- **Backend API (Render)**: [https://airbnb-backends.onrender.com](https://airbnb-backends.onrender.com)
- **Database**: MongoDB Atlas Cloud (`Cluster0`)

---

## 🔑 Test Credentials

| Role | Email | Password | Features |
|---|---|---|---|
| **Admin** | `admin@example.com` | `password123` | System Administrator |
| **User (Renter)** | `john@example.com` | `password123` | Active bookings, property reservations |
| **Host** | `jane@example.com` | `password123` | Host dashboard, property creation |
| **User (Renter)** | `alice@example.com` | `password123` | Active bookings |

---

## ✨ Features

- 📱 **Fully Responsive UI**: Mobile-friendly hamburger navigation, responsive property cards, modal filters, and touch-optimized controls.
- 🔐 **Authentication & Security**: Password hashing with `bcryptjs`, JWT token authorization, and protected routes.
- 🔍 **Search & Advanced Filtering**: Filter properties by search term, location, min/max price, and guest count.
- 🏠 **Host Management**: Users can convert their account to a host, list properties with custom titles, images, descriptions, and pricing.
- 📅 **Booking Workflows**: Reserve properties for date ranges with guest count validation and booking cancellation capabilities.
- ⚡ **DB Auto-Seeding**: Automatic data population of properties, users, and bookings.

---

## 🛠️ Technology Stack

- **Frontend**: React (v18), React Router (v6), TailwindCSS, Axios
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcryptjs, CORS
- **Database**: MongoDB Atlas
- **Hosting**: Vercel (Frontend), Render (Backend)

---

## 🚀 Local Development Setup

### 1. Backend Setup
```bash
cd airbnb-backend
npm install
node seed.js    # Seed database
npm start       # Starts server on port 5000
```

### 2. Frontend Setup
```bash
cd airbnb-frontend
npm install
npm start       # Starts app on port 3000
```

---

## 📄 API Endpoints Summary

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Register/Login user
- `PUT /api/auth/become-host` - Convert user to host
- `GET /api/auth/me` - Get logged-in user profile

### Properties
- `GET /api/properties` - Paginated properties with search & price filters
- `GET /api/properties/:id` - Property details
- `POST /api/properties` - Create new property (Hosts)

### Bookings
- `POST /api/bookings` - Create reservation
- `GET /api/bookings/my` - User reservations
- `GET /api/bookings/host` - Host property bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking
