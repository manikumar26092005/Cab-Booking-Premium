const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Driver = require("../models/DriverSchema");
const MyBooking = require("../models/MyBookingSchema");
const Car = require("../models/CarSchema");

// Register Driver
const registerDriver = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingDriver = await Driver.findOne({ email });

    if (existingDriver) {
      return res.status(400).json({
        message: "Driver already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const driver = await Driver.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Driver registered successfully",
      driver,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login Driver
const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email });

    if (!driver) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, driver.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: driver._id,
        role: "driver",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    res.json({
      token,
      driver,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Driver Profile
const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id)
      .select("-password")
      .populate("car");

    res.json(driver);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Assigned Rides
const getAssignedRides = async (req, res) => {
  try {
    const rides = await MyBooking.find({
      driver: req.user.id,
    })
      .populate("user", "name email")
      .populate("car", "carModel carNo price")
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);

    const completedRides = await MyBooking.find({
      driver: req.user.id,
      status: "Completed",
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let todaysEarnings = 0;

    completedRides.forEach((ride) => {
      if (new Date(ride.updatedAt) >= today) {
        todaysEarnings += Number(ride.fare || 0);
      }
    });

    res.json({
      totalEarnings: driver.totalEarnings || 0,
      todaysEarnings,
      completedRidesCount: completedRides.length,
      availability: "Available",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Accept / Reject Ride
const respondToRide = async (req, res) => {
  try {
    const { response } = req.body;

    const ride = await MyBooking.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    if (response === "Accepted") {
      ride.status = "Accepted";
      ride.driverRequestStatus = "Accepted";
    } else {
      ride.status = "Pending";
      ride.driverRequestStatus = "Rejected";
      ride.driver = null;
    }

    await ride.save();

    res.json({
      message: "Ride updated successfully",
      ride,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Start Ride / Complete Ride
const updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ride = await MyBooking.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    if (!["On the Way", "Completed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid ride status",
      });
    }

    ride.status = status;

    if (status === "Completed") {
      const driver = await Driver.findById(req.user.id);

      if (driver) {
        driver.totalEarnings =
          (driver.totalEarnings || 0) + Number(ride.fare);

        await driver.save();
      }
    }

    await ride.save();

    res.json({
      message: "Ride status updated successfully",
      ride,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Driver Earnings
const getEarnings = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);

    const rides = await MyBooking.find({
      driver: req.user.id,
      status: "Completed",
    }).sort({ updatedAt: -1 });

    res.json({
      totalEarnings: driver.totalEarnings || 0,
      ridesCompleted: rides.length,
      history: rides,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin - Get All Drivers
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find()
      .select("-password")
      .populate("car");

    res.json(drivers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Assign Car to Driver
const assignCarToDriver = async (req, res) => {
  try {
    const { carId } = req.body;

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      {
        car: carId,
      },
      {
        new: true,
      }
    ).populate("car");

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    res.json({
      message: "Car assigned successfully",
      driver,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Driver
const deleteDriver = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);

    res.json({
      message: "Driver deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
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
};