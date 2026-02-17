require("dotenv").config();
jest.mock("../middleware/requireAuth", () => (req, res, next) => next());

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const Booking = require("../models/booking");
const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const Service = require("../models/service");

jest.setTimeout(30000);

describe("Bookings GET routes", () => {
  let userId, vehicleId, serviceId, bookingId;

  beforeAll(async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
    if (!uri) throw new Error("Missing MONGODB_URI (or MONGODB_URL) in .env");

    await mongoose.connect(uri);

    const u = await User.create({
      name: "Booking Test User",
      email: `booking_user_${Date.now()}@test.com`,
      password: "password123",
    });
    userId = u._id.toString();

    const v = await Vehicle.create({
      ownerId: userId,
      make: "Toyota",
      model: "Corolla",
      year: 2023,
      vin: `VIN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      fuelType: "Gasoline",
    });
    vehicleId = v._id.toString();

    const s = await Service.create({
      name: `Service ${Date.now()}`,
      description: "Test service",
      durationMinutes: 30,
      price: 49.99,
    });
    serviceId = s._id.toString();

    const b = await Booking.create({
      userId,
      vehicleId,
      serviceId,
      date: new Date(),
      status: "pending"
    });

    bookingId = b._id.toString();
  });

  afterAll(async () => {
    if (bookingId) await Booking.deleteOne({ _id: bookingId });
    if (vehicleId) await Vehicle.deleteOne({ _id: vehicleId });
    if (serviceId) await Service.deleteOne({ _id: serviceId });
    if (userId) await User.deleteOne({ _id: userId });

    await mongoose.connection.close();
  });

  // Test paginación
  test("GET /bookings returns paginated result", async () => {
    const res = await request(app).get("/bookings?page=1&limit=5");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("results");
    expect(Array.isArray(res.body.results)).toBe(true);
  });

  // Test filtro dinámico
  test("GET /bookings supports filtering by status", async () => {
    const res = await request(app).get("/bookings?status=pending");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true);
  });

  // Test get single
  test("GET /bookings/:id returns 200 and the booking", async () => {
    const res = await request(app).get(`/bookings/${bookingId}`);

    expect(res.statusCode).toBe(200);
    expect((res.body._id || res.body.id).toString()).toBe(bookingId);
    expect(res.body.userId).toBeTruthy();
    expect(res.body.vehicleId).toBeTruthy();
    expect(res.body.serviceId).toBeTruthy();
  });
});
