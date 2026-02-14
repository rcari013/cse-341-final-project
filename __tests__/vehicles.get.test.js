require("dotenv").config();

// If /vehicles GETALL is protected in your requireAuth middleware,
// this makes the route accessible for testing without changing app code.
jest.mock("../middleware/requireAuth", () => (req, res, next) => next());

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const User = require("../models/user");
const Vehicle = require("../models/vehicle");

jest.setTimeout(30000);

describe("Vehicles GET routes", () => {
  let userId;
  let vehicleId;

  beforeAll(async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
    if (!uri) throw new Error("Missing MONGODB_URI (or MONGODB_URL) in .env");

    // Connect to Mongo for tests (prevents buffering timeout)
    await mongoose.connect(uri);

    // Create an owner user (ownerId is required)
    const u = await User.create({
      name: "Vehicle Test Owner",
      email: `veh_owner_${Date.now()}@test.com`,
      password: "password123",
    });

    userId = u._id.toString();

    // Create a vehicle with unique VIN
    const v = await Vehicle.create({
      ownerId: userId,
      make: "Toyota",
      model: "Corolla",
      year: 2023,
      vin: `VIN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      color: "Black",
      licensePlate: "TEST-123",
      fuelType: "Hybrid",
    });

    vehicleId = v._id.toString();
  });

  afterAll(async () => {
    // cleanup (optional but keeps DB clean)
    if (vehicleId) await Vehicle.deleteOne({ _id: vehicleId });
    if (userId) await User.deleteOne({ _id: userId });

    await mongoose.connection.close();
  });

  test("GET /vehicles returns 200 and an array", async () => {
    const res = await request(app).get("/vehicles");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /vehicles/:id returns 200 and the vehicle", async () => {
    const res = await request(app).get(`/vehicles/${vehicleId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect((res.body._id || res.body.id).toString()).toBe(vehicleId);
    expect(res.body.make).toBe("Toyota");
    expect(res.body.vin).toBeTruthy();
  });
});
