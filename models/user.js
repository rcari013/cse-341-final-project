const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      match: /^\S+@\S+\.\S+$/,
      trim: true,
      unique: true
    },

    phone: {
      type: String,
      trim: true,
      default: ""
    },

    address: {
      type: String,
      trim: true,
      default: ""
    },

    password: {
      type: String,
      required: true,
      trim: true
    },

    role: {
      type: String,
      enum: ["admin", "customer", "staff"],
      default: "customer",
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("User", userSchema);
