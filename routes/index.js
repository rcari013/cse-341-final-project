const router = require('express').Router();

// Routes
router.use('/', require('./swagger'));
// router.use('/auth', require('./auth'));
router.use('/vehicle', require('./vehicle'));
// router.use('/service', require('./service'));
// router.use('/booking', require('./booking'));

module.exports = router;