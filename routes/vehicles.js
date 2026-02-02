const express = require('express');
const router = express.Router();
const vehiclesController = require('../controllers/vehicle-controller');

// GET
router.get('/', vehiclesController.getAllVehicles);
router.get('/:id', vehiclesController.getVehicleById);

// POST
router.post('/', vehiclesController.createVehicle);

// PUT
router.put('/:id', vehiclesController.updateVehicle);

// DELETE
router.delete('/:id', vehiclesController.deleteVehicle);

module.exports = router;
