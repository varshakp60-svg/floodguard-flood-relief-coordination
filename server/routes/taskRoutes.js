
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Task = require("../models/task");
const User = require("../models/user");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create uploads folder
const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Image upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" +
      file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");

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

// Admin-only access
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only admins can assign tasks"
    });
  }
  next();
};

// POST: Admin assigns a task to a volunteer
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, location, assignedTo } = req.body;

    if (!title || !description || !location || !assignedTo) {
      return res.status(400).json({
        message: "Please provide all required fields"
      });
    }

    if (!/^[a-fA-F0-9]{24}$/.test(assignedTo)) {
      return res.status(400).json({
        message: "Invalid volunteer ID"
      });
    }

    const volunteer = await User.findOne({
      _id: assignedTo,
      role: "volunteer"
    });

    if (!volunteer) {
      return res.status(404).json({
        message: "Volunteer not found"
      });
    }

    const task = await Task.create({
      title,
      description,
      location,
      assignedTo
    });

    res.status(201).json({
      message: "Task assigned successfully!",
      task
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to assign task",
      error: error.message
    });
  }
});

// GET: Admin views all tasks; volunteers view their own tasks
router.get("/", protect, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find()
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 });
    } else if (req.user.role === "volunteer") {
      tasks = await Task.find({
        assignedTo: req.user.id
      }).sort({ createdAt: -1 });
    } else {
      return res.status(403).json({
        message: "You are not allowed to view volunteer tasks"
      });
    }

    res.json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message
    });
  }
});

// PUT: Volunteer updates task status and uploads completion proof
router.put(
  "/:id/status",
  protect,
  upload.single("proofImage"),
  async (req, res) => {
    try {
      if (req.user.role !== "volunteer") {
        return res.status(403).json({
          message: "Only volunteers can update task progress"
        });
      }

      if (!/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
        return res.status(400).json({
          message: "Invalid task ID"
        });
      }

      const { status } = req.body;

      const allowedTransitions = {
        assigned: "accepted",
        accepted: "in-progress",
        "in-progress": "completed"
      };

      const task = await Task.findOne({
        _id: req.params.id,
        assignedTo: req.user.id
      });

      if (!task) {
        return res.status(404).json({
          message: "Assigned task not found"
        });
      }

      if (allowedTransitions[task.status] !== status) {
        return res.status(400).json({
          message: "Invalid task status transition"
        });
      }

      if (status === "completed" && !req.file) {
        return res.status(400).json({
          message: "Please upload a completion proof image"
        });
      }

      task.status = status;

      if (req.file) {
        task.proofImage = `/uploads/${req.file.filename}`;
      }

      await task.save();

      res.json({
        message: "Task updated successfully!",
        task
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update task",
        error: error.message
      });
    }
  }
);

module.exports = router;
