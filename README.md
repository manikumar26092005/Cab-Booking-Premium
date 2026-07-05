# 🚖 UCab Premium - MERN Cab Booking System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) Cab Booking application with separate dashboards for **Users**, **Drivers**, and **Administrators**.

---

# 📌 Project Overview

UCab Premium is an online cab booking platform where users can book rides, administrators can manage bookings, drivers, and cars, while drivers can accept, start, and complete assigned rides.

---

# ✨ Features

## 👤 User
- User Registration & Login
- Book a Cab
- View My Bookings
- Cancel Booking
- Download Booking Receipt
- Secure JWT Authentication

## 🚖 Driver
- Driver Login
- View Assigned Rides
- Accept Ride
- Reject Ride
- Start Ride
- Complete Ride
- Earnings Dashboard

## 🛠 Admin
- Admin Login
- Dashboard
- Manage Users
- Manage Drivers
- Manage Cars
- Assign Driver
- Reassign Driver
- Cancel Booking
- View Reports

---

# 🛠 Tech Stack

### Frontend
- React.js
- Vite
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT
- bcryptjs

---

# 📁 Project Structure

```text
Cab-Booking-Premium
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middlewares
│   ├── config
│   └── server.js
│
├── screenshots
│   ├── home.png
│   ├── login.png
│   ├── admin-dashboard.png
│   ├── driver-dashboard.png
│   ├── bookings.png
│   └── cars.png
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/manikumar26092005/Cab-Booking-Premium.git
```

## Install Frontend

```bash
cd client
npm install
npm run dev
```

## Install Backend

```bash
cd server
npm install
npm run dev
```

---

# 🔐 Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=8000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
JWT_EXPIRES_IN=7d
```

---

# 📸 Screenshots

## 🏠 Home Page

<img src="./screenshots/home.png" width="900"/>

---

## 🔐 Login Page

<img src="./screenshots/login.png" width="900"/>

---

## 🛠 Admin Dashboard

<img src="./screenshots/admin-dashboard.png" width="900"/>

---

## 🚖 Driver Dashboard

<img src="./screenshots/driver-dashboard.png" width="900"/>

---

## 📋 Bookings

<img src="./screenshots/bookings.png" width="900"/>

---

## 🚗 Cars Management

<img src="./screenshots/cars.png" width="900"/>

---

# 🚀 Future Enhancements

- Online Payment Integration
- Google Maps Integration
- Live Driver Tracking
- Ride Rating System
- Push Notifications
- Email Notifications
- Mobile Application

---

# 👨‍💻 Developed By

**Paidipati Manikumar**

B.Tech - Electronics and Communication Engineering (ECE)

Annamacharya Institute of Technology & Sciences, Tirupati

---

# 📄 License

This project is developed for educational purposes only.