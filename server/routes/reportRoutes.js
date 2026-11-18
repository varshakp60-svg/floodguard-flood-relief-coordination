
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Report = require("../models/report");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// POST: Submit flood report
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      severity,
      requestTeam,
      lat,
      lng
    } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        message: "Title, description and location are required"
      });
    }

    const report = new Report({
      reportedBy: req.user.id,
      title,
      description,
      location,
      severity: severity || "High",
      requestTeam: requestTeam === "true",
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      image: req.file ? `/uploads/${req.file.filename}` : ""
    });

    await report.save();

    res.status(201).json({
      message: "Flood report submitted successfully!",
      report
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to submit flood report",
      error: error.message
    });
  }
});

// GET: View all flood reports
router.get("/", protect, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: reports.length,
      reports
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch flood reports",
      error: error.message
    });
  }
});

module.exports = router;
