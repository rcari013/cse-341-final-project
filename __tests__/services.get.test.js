require("dotenv").config();

// If your GETALL routes are protected, bypass auth in tests (no app changes)
jest.mock("../middleware/requireAuth", () => (req, res, next) => next());

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const Service = require("../models/service");

jest.setTimeout(30000);

describe("Services GET routes", () => {
  let serviceId;

  beforeAll(async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
    if (!uri) throw new Error("Missing MONGODB_URI (or MONGODB_URL) in .env");

    await mongoose.connect(uri);

    const s = await Service.create({
      name: `Oil Change ${Date.now()}`,
      description: "Basic oil change service",
      durationMinutes: 30,     // required
      price: 49.99,            // required
      isActive: true,
      category: "Maintenance",
      requiresAppointment: true,
    });

    serviceId = s._id.toString();
  });

  afterAll(async () => {
    if (serviceId) await Service.deleteOne({ _id: serviceId });
    await mongoose.connection.close();
  });

  test("GET /services returns 200 and an array", async () => {
    const res = await request(app).get("/services");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /services/:id returns 200 and the service", async () => {
    const res = await request(app).get(`/services/${serviceId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect((res.body._id || res.body.id).toString()).toBe(serviceId);

    // a couple sanity checks
    expect(res.body.durationMinutes).toBe(30);
    expect(res.body.price).toBe(49.99);
  });
});
