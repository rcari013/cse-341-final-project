const router = require("express").Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger/swagger.json");

const options = {
  explorer: true,
  swaggerOptions: {
    docExpansion: "none",
    defaultModelsExpandDepth: -1
  }
};

router.use("/documentation", swaggerUi.serve);
router.get("/documentation", swaggerUi.setup(swaggerDocument, options));

module.exports = router;
