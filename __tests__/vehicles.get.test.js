require("dotenv").config();

// If routes are protected, bypass auth in tests
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

    await mongoose.connect(uri);

    const u = await User.create({
      name: "Vehicle Test Owner",
      email: `veh_owner_${Date.now()}@test.com`,
      password: "password123",
    });

    userId = u._id.toString();

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
    if (vehicleId) await Vehicle.deleteOne({ _id: vehicleId });
    if (userId) await User.deleteOne({ _id: userId });

    await mongoose.connection.close();
  });

  test("GET /vehicles returns 200 and paginated structure", async () => {
    const res = await request(app).get("/vehicles");

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("results");

    expect(Array.isArray(res.body.results)).toBe(true);

    if (res.body.results.length > 0) {
      const vehicle = res.body.results[0];

      // populate check
      expect(vehicle).toHaveProperty("ownerId");

      // ensure password is not exposed
      if (vehicle.ownerId) {
        expect(vehicle.ownerId).not.toHaveProperty("password");
      }
    }
  });

  test("GET /vehicles with pagination works", async () => {
    const res = await request(app).get("/vehicles?page=1&limit=5");

    expect(res.statusCode).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.results.length).toBeLessThanOrEqual(5);
  });

  test("GET /vehicles/:id returns 200 and the vehicle", async () => {
    const res = await request(app).get(`/vehicles/${vehicleId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect((res.body._id || res.body.id).toString()).toBe(vehicleId);
    expect(res.body.make).toBe("Toyota");
    expect(res.body.vin).toBeTruthy();

    // populated owner should not expose password
    if (res.body.ownerId) {
      expect(res.body.ownerId).not.toHaveProperty("password");
    }
  });
});
