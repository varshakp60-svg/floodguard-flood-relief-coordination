
const express = require("express");
const ReliefCenter = require("../models/ReliefCenter");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only admins can perform this action"
    });
  }
  next();
};

// POST: Add relief center (Admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      location,
      capacity,
      availableSlots,
      contact,
      lat,
      lng
    } = req.body;

    if (!name || !location || capacity == null || availableSlots == null) {
      return res.status(400).json({
        message: "Please provide all required fields"
      });
    }

    if (
      !Number.isInteger(capacity) ||
      !Number.isInteger(availableSlots) ||
      capacity < 1 ||
      availableSlots < 0 ||
      availableSlots > capacity ||
      lat === undefined || lat === null || String(lat).trim() === "" ||
      lng === undefined || lng === null || String(lng).trim() === "" ||
      !Number.isFinite(Number(lat)) ||
      !Number.isFinite(Number(lng)) ||
      Math.abs(Number(lat)) > 90 ||
      Math.abs(Number(lng)) > 180
    ) {
      return res.status(400).json({
        message: "Invalid capacity or available slots"
      });
    }

    const center = await ReliefCenter.create({
      name,
      location,
      capacity,
      availableSlots,
      contact,
      lat: Number(lat),
      lng: Number(lng)
    });

    res.status(201).json({
      message: "Relief center added successfully!",
      center
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add relief center",
      error: error.message
    });
  }
});

// GET: View all relief centers (Authenticated users)
router.get("/", protect, async (req, res) => {
  try {
    const centers = await ReliefCenter.find().sort({ createdAt: -1 });

    res.json({
      count: centers.length,
      centers
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch relief centers",
      error: error.message
    });
  }
});

// PUT: Update relief center (Admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { name, location, capacity, availableSlots, contact, status, lat, lng } = req.body;

    if (
      capacity !== undefined &&
      (!Number.isInteger(capacity) || capacity < 1)
    ) {
      return res.status(400).json({ message: "Invalid capacity" });
    }

    if (
      availableSlots !== undefined &&
      (!Number.isInteger(availableSlots) || availableSlots < 0)
    ) {
      return res.status(400).json({ message: "Invalid available slots" });
    }

    if (status !== undefined && !["open", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if ((lat !== undefined && (!Number.isFinite(Number(lat)) || Math.abs(Number(lat)) > 90)) ||
        (lng !== undefined && (!Number.isFinite(Number(lng)) || Math.abs(Number(lng)) > 180))) {
      return res.status(400).json({ message: "Invalid map coordinates" });
    }

    const center = await ReliefCenter.findById(req.params.id);

    if (!center) {
      return res.status(404).json({ message: "Relief center not found" });
    }

    Object.assign(center, {
      name,
      location,
      capacity,
      availableSlots,
      contact,
      status,
      lat: lat === undefined ? center.lat : Number(lat),
      lng: lng === undefined ? center.lng : Number(lng)
    });

    if (center.availableSlots > center.capacity) {
      return res.status(400).json({
        message: "Available slots cannot exceed capacity"
      });
    }

    await center.save();

    res.json({
      message: "Relief center updated successfully!",
      center
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update relief center",
      error: error.message
    });
  }
});

module.exports = router;
