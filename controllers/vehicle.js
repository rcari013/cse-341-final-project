const Vehicle = require('../models/vehicle');

// GET all vehicles
const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (err) {
    next(err);
  }
};

// GET vehicle by ID
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    res.status(200).json(vehicle);
  } catch (err) {
    next(err);
  }
};

// POST create vehicle
const createVehicle = async (req, res, next) => {
  try {
    const vehicle = new Vehicle(req.body);
    const savedVehicle = await vehicle.save();
    res.status(201).json(savedVehicle);
  } catch (err) {
    next(err);
  }
};

// PUT update vehicle
const updateVehicle = async (req, res, next) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
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
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    res.status(200).json({ message: 'Vehicle deleted.' });
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
