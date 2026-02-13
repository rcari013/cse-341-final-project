const router = require('express').Router();

// Vehicle routes
router.use('/vehicles', require('./vehicles'));

// Service routes
router.use('/services', require('./services'));
router.use('/users', require('./users'));
router.use('/bookings', require('./bookings'));


module.exports = router;
