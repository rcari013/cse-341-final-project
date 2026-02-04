export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors
    });
  }

  // Invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format"
    });
  }

  // Duplicate key error (e.g. unique email later)
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate key error"
    });
  }

  // Default fallback
  res.status(500).json({
    message: "Internal server error"
  });
};
