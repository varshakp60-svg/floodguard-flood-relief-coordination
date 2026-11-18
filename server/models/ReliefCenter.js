
const mongoose = require("mongoose");

const reliefCenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
    },

    availableSlots: {
      type: Number,
      required: true,
      min: 0
    },

    contact: {
      type: String,
      default: ""
    },

    lat: { type: Number, default: null },
    lng: { type: Number, default: null },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReliefCenter", reliefCenterSchema);
