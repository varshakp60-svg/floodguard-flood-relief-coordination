
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const alertRoutes = require("./routes/alertRoutes");
const reliefCenterRoutes = require("./routes/ReliefCenterRoutes");
const taskRoutes = require("./routes/taskRoutes");

const protect = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/relief-centers", reliefCenterRoutes);
app.use("/api/tasks", taskRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("FloodGuard Backend is Running Successfully!");
});

// Protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are successfully authenticated!",
    user: req.user
  });
});

// Connect MongoDB and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully!");

    app.listen(PORT, () => {
      console.log(`FloodGuard server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
  }
};

startServer();
