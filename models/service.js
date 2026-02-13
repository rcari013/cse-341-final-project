const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    category: {
      type: String,
      trim: true
    },
    requiresAppointment: {
      type: Boolean,
      default: true
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Service", serviceSchema);
