const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    githubId: {
      type: String,
      required: [true, "GitHub ID is required"],
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: 3,
      maxlength: 30,
      trim: true,
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
