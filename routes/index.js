const router = require("express").Router();

router.use("/auth", require("./auth"));

// Vehicle routes
router.use("/vehicles", require("./vehicles"));

// Service routes
router.use("/services", require("./services"));

// Booking routes
router.use("/bookings", require("./bookings"));

// User routes
router.use("/users", require("./users"));

// Swagger documentation route
router.use("/", require("./swagger"));

module.exports = router;
