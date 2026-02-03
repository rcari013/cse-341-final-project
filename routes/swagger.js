const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');

router.use('/documentation', swaggerUi.serve);
router.get('/documentation', swaggerUi.setup(swaggerDocument));

module.exports = router
