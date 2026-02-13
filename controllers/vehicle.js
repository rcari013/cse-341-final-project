const mongoose = require("mongoose");
const Vehicle = require("../models/vehicle");
const User = require("../models/user");

// GET all vehicles
const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find()
      .populate({ path: "ownerId", select: "-password" });

    res.status(200).json(vehicles);
  } catch (err) {
    next(err);
  }
};

// GET vehicle by ID
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate({ path: "ownerId", select: "-password" });

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found." });
    }

    res.status(200).json(vehicle);
  } catch (err) {
    next(err);
  }
};

// helper: validate ownerId
async function validateOwner(ownerId) {
  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return { ok: false, message: "ownerId is not a valid ObjectId" };
  }

  const ownerExists = await User.exists({ _id: ownerId });
  if (!ownerExists) {
    return { ok: false, message: "ownerId does not exist" };
  }

  return { ok: true };
}

// POST create vehicle
const createVehicle = async (req, res, next) => {
  try {
    const payload = req.body;

    // BULK
    if (Array.isArray(payload)) {
      if (payload.length === 0) {
        return res.status(400).json({ error: "Request body array is empty." });
      }

      // validate all ownerIds first
      const results = await Promise.all(
        payload.map(async (v, idx) => {
          if (!v.ownerId) return { index: idx, error: "ownerId is required." };
          const check = await validateOwner(v.ownerId);
          return check.ok ? null : { index: idx, error: check.message };
        })
      );

      const errors = results.filter(Boolean);
      if (errors.length) {
        return res.status(400).json({ error: "Validation failed", errors });
      }

      const savedVehicles = await Vehicle.insertMany(payload, {
        ordered: true,
        runValidators: true
      });

      return res.status(201).json(savedVehicles);
    }

    // SINGLE
    const { ownerId, ...rest } = payload;

    if (!ownerId) {
      return res.status(400).json({ error: "ownerId is required." });
    }

    const check = await validateOwner(ownerId);
    if (!check.ok) {
      return res.status(400).json({ error: check.message });
    }

    const vehicle = await Vehicle.create({ ownerId, ...rest });
    return res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
};


// PUT update vehicle
const updateVehicle = async (req, res, next) => {
  try {
    // if ownerId is being updated, validate it
    if (req.body.ownerId) {
      const check = await validateOwner(req.body.ownerId);
      if (!check.ok) {
        return res.status(400).json({ error: check.message });
      }
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ error: "Vehicle not found." });
    }

    res.status(200).json(updatedVehicle);
  } catch (err) {
    next(err);
  }
};

// DELETE vehicle
const deleteVehicle = async (req, res, next) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!deletedVehicle) {
      return res.status(404).json({ error: "Vehicle not found." });
    }

    res.status(200).json({ message: "Vehicle deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
