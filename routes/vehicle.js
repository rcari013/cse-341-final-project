// Import necessary modules
const express = require('express');

// Create a new router instance
const router = express.Router();

// Import controller functions
const {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicle');

// Define routes
router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

// Export the router
module.exports = router;
