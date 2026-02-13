const mongoose = require("mongoose");
const Booking = require("../models/booking.js");
const User = require("../models/user.js");
const Vehicle = require("../models/vehicle.js");
const Service = require("../models/service.js");

// ---------- helpers ----------
async function validateRefs({ userId, vehicleId, serviceId }) {
  const ids = { userId, vehicleId, serviceId };

  for (const [key, val] of Object.entries(ids)) {
    if (!mongoose.Types.ObjectId.isValid(val)) {
      return { ok: false, message: `${key} is not a valid ObjectId` };
    }
  }

  const [user, vehicle, service] = await Promise.all([
    User.exists({ _id: userId }),
    Vehicle.exists({ _id: vehicleId }),
    Service.exists({ _id: serviceId })
  ]);

  if (!user) return { ok: false, message: "userId does not exist" };
  if (!vehicle) return { ok: false, message: "vehicleId does not exist" };
  if (!service) return { ok: false, message: "serviceId does not exist" };

  return { ok: true };
}

// ---------- controllers ----------

// GET all bookings
exports.getAll = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate({ path: "userId", select: "-password" }) // ✅ hide password
      .populate("vehicleId")
      .populate("serviceId");

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

// GET booking by ID
exports.getSingle = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({ path: "userId", select: "-password" }) // ✅ hide password
      .populate("vehicleId")
      .populate("serviceId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

// POST create booking (single OR bulk)
exports.createBooking = async (req, res, next) => {
  try {
    const payload = req.body;

    if (Array.isArray(payload)) {
      if (payload.length === 0) {
        return res.status(400).json({ message: "Request body array is empty" });
      }

      const results = await Promise.all(
        payload.map(async (b, idx) => {
          const r = await validateRefs(b);
          return r.ok ? null : { index: idx, error: r.message };
        })
      );

      const errors = results.filter(Boolean);
      if (errors.length) {
        return res.status(400).json({ message: "Validation failed", errors });
      }

      const saved = await Booking.insertMany(payload, {
        ordered: true,
        runValidators: true
      });

      return res.status(201).json(saved);
    }

    const refCheck = await validateRefs(payload);
    if (!refCheck.ok) {
      return res.status(400).json({ message: "Validation failed", error: refCheck.message });
    }

    const savedBooking = await Booking.create(payload);
    return res.status(201).json(savedBooking);
  } catch (err) {
    next(err);
  }
};

// PUT update booking
exports.updateBooking = async (req, res, next) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(updatedBooking);
  } catch (err) {
    next(err);
  }
};

// DELETE booking
exports.deleteBooking = async (req, res, next) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    next(err);
  }
};
