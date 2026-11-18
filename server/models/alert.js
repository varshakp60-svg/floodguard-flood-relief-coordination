
const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
