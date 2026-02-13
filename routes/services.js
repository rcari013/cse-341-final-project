const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/service');


// GET
router.get('/', servicesController.getAllServices);
router.get('/:id', servicesController.getServiceById);

// POST
router.post('/', servicesController.createService);

// PUT
router.put('/:id', servicesController.updateService);

// DELETE
router.delete('/:id', servicesController.deleteService);

module.exports = router;
