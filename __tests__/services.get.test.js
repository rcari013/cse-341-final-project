require("dotenv").config();

// If your GET routes are protected, bypass auth in tests
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
      durationMinutes: 30,
      price: 49.99,
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

  test("GET /services returns 200 and paginated structure", async () => {
    const res = await request(app).get("/services");

    expect(res.statusCode).toBe(200);

    // Nueva estructura
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("results");

    expect(Array.isArray(res.body.results)).toBe(true);
  });

  test("GET /services with pagination works", async () => {
    const res = await request(app).get("/services?page=1&limit=5");

    expect(res.statusCode).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.results.length).toBeLessThanOrEqual(5);
  });

  test("GET /services/:id returns 200 and the service", async () => {
    const res = await request(app).get(`/services/${serviceId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect((res.body._id || res.body.id).toString()).toBe(serviceId);

    expect(res.body.durationMinutes).toBe(30);
    expect(res.body.price).toBe(49.99);
  });
});
