
const express = require("express");
const Alert = require("../models/alert");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Admin-only access
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only admins can perform this action"
    });
  }
  next();
};

// POST: Create emergency alert (Admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, message, severity, location } = req.body;

    if (!title || !message || !location) {
      return res.status(400).json({
        message: "Title, message and location are required"
      });
    }

    const alert = await Alert.create({
      title,
      message,
      severity,
      location,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: "Alert created successfully!",
      alert
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create alert",
      error: error.message
    });
  }
});

// GET: View active alerts (Authenticated users)
router.get("/", protect, async (req, res) => {
  try {
    const alerts = await Alert.find({ status: "active" })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch alerts",
      error: error.message
    });
  }
});

// PUT: Update alert status (Admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Invalid alert status"
      });
    }

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found"
      });
    }

    res.json({
      message: "Alert updated successfully!",
      alert
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update alert",
      error: error.message
    });
  }
});

module.exports = router;
