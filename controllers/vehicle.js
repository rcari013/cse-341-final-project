const mongoose = require('mongoose');
const Vehicle = require('../models/vehicle');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllVehicles = async (req, res) => {

  // #swagger.tags=['Vehicle']

  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles.' });
  }
};

const getVehicleById = async (req, res) => {

  // #swagger.tags=['Vehicle']

  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: 'Invalid vehicle id.' });
  }

  try {
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle.' });
  }
};

const createVehicle = async (req, res) => {

  // #swagger.tags=['Vehicle']

  const { make, model, year, vin } = req.body;

  try {
    const vehicle = await Vehicle.create({ make, model, year, vin });
    res.status(201).json(vehicle);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(422).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to create vehicle.' });
  }
};

const updateVehicle = async (req, res) => {

  // #swagger.tags=['Vehicle']

  const { id } = req.params;
  const { make, model, year, vin } = req.body;

  if (!isValidId(id)) {
    return res.status(400).json({ error: 'Invalid vehicle id.' });
  }

  try {
    const vehicle = await Vehicle.findByIdAndUpdate(id, { make, model, year, vin }, {
      new: true,
      runValidators: true
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(422).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to update vehicle.' });
  }
};

const deleteVehicle = async (req, res) => {

  // #swagger.tags=['Vehicle']

  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: 'Invalid vehicle id.' });
  }

  try {
    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    res.status(200).json({ message: 'Vehicle deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vehicle.' });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
