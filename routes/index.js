const router = require('express').Router();

// Vehicle routes
router.use('/vehicles', require('./vehicles'));

// Service routes
router.use('/services', require('./services'));

module.exports = router;
