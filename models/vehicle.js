const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    make: {
      type: String,
      required: true,
      trim: true
    },
    model: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true,
      min: 1886
    },
    vin: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    color: {
      type: String,
      trim: true
    },
    licensePlate: {
      type: String,
      trim: true
    },
    fuelType: {
      type: String,
      enum: ['Gasoline', 'Diesel', 'Hybrid', 'Electric'],
      default: 'Gasoline'
    }
  },
  {
    collection: 'vehicles',
    versionKey: false
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
