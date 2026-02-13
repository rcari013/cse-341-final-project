const User = require("../models/user");

// GET all users
exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// GET user by ID
exports.getSingle = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// POST create user (single OR bulk)
exports.createUser = async (req, res, next) => {
  try {
    if (Array.isArray(req.body)) {
      for (const [i, u] of req.body.entries()) {
        if (!u || typeof u !== "object") {
          return res.status(400).json({ message: `Invalid user object at index ${i}` });
        }
        if (!u.name || !u.email || !u.password) {
          return res.status(400).json({
            message: "Validation failed",
            error: `User at index ${i} is missing required fields (name, email, password)`
          });
        }
      }

      try {
        const savedUsers = await User.insertMany(req.body, {
          ordered: true,
          runValidators: true
        });

        return res.status(201).json({
          count: savedUsers.length,
          users: savedUsers
        });
      } catch (bulkErr) {
        return res.status(400).json({
          message: "Bulk insert failed",
          error: bulkErr.message,
          details: bulkErr.writeErrors || bulkErr.errors || null
        });
      }
    }

    const user = new User(req.body);
    const savedUser = await user.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
};

// PUT update user
exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// DELETE user
exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};
