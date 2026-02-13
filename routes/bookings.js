const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookings');

// GET
router.get('/', bookingsController.getAll);
router.get('/:id', bookingsController.getSingle);

// POST
router.post('/', bookingsController.createBooking);

// PUT
router.put('/:id', bookingsController.updateBooking);

// DELETE
router.delete('/:id', bookingsController.deleteBooking);

module.exports = router;
