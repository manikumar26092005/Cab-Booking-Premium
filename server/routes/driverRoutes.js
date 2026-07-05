const express = require("express");
const router = express.Router();

const {
  registerDriver,
  loginDriver,
  getDriverProfile,
  getAssignedRides,
  getDashboardStats,
  respondToRide,
  updateRideStatus,
  getEarnings,
  getAllDrivers,
  assignCarToDriver,
  deleteDriver,
} = require("../controllers/driverController");

const {
  authMiddleware,
  adminMiddleware,
  driverMiddleware,
} = require("../middlewares/authMiddleware");

// Driver Authentication
router.post("/register", registerDriver);
router.post("/login", loginDriver);

// Driver Routes
router.get(
  "/profile",
  authMiddleware,
  driverMiddleware,
  getDriverProfile
);

router.get(
  "/dashboard-stats",
  authMiddleware,
  driverMiddleware,
  getDashboardStats
);

router.get(
  "/rides",
  authMiddleware,
  driverMiddleware,
  getAssignedRides
);

router.put(
  "/rides/:id/respond",
  authMiddleware,
  driverMiddleware,
  respondToRide
);

router.put(
  "/rides/:id/status",
  authMiddleware,
  driverMiddleware,
  updateRideStatus
);

router.get(
  "/earnings",
  authMiddleware,
  driverMiddleware,
  getEarnings
);

// Admin Routes
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllDrivers
);

router.put(
  "/:id/assign-car",
  authMiddleware,
  adminMiddleware,
  assignCarToDriver
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteDriver
);

module.exports = router;