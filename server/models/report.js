
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    severity: {
      type: String,
      enum: ["Critical", "High", "Medium", "Low"],
      default: "High"
    },

    requestTeam: {
      type: Boolean,
      default: true
    },

    lat: {
      type: Number,
      default: null
    },

    lng: {
      type: Number,
      default: null
    },

    image: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["pending", "verified", "resolved"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
