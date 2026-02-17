require("dotenv").config();

// If GET routes are protected, bypass auth in tests
jest.mock("../middleware/requireAuth", () => (req, res, next) => next());

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const User = require("../models/user");

jest.setTimeout(30000);

describe("Users GET routes", () => {
  let userId;

  beforeAll(async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
    if (!uri) throw new Error("Missing MONGODB_URI (or MONGODB_URL) in .env");

    await mongoose.connect(uri);

    const u = await User.create({
      name: "Test User",
      email: `user_${Date.now()}@test.com`,
      password: "password123",
      role: "customer",
      isActive: true,
    });

    userId = u._id.toString();
  });

  afterAll(async () => {
    if (userId) await User.deleteOne({ _id: userId });
    await mongoose.connection.close();
  });

  test("GET /users returns 200 and paginated structure", async () => {
    const res = await request(app).get("/users");

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("results");

    expect(Array.isArray(res.body.results)).toBe(true);

    // Security check
    if (res.body.results.length > 0) {
      expect(res.body.results[0]).not.toHaveProperty("password");
    }
  });

  test("GET /users with pagination works", async () => {
    const res = await request(app).get("/users?page=1&limit=5");

    expect(res.statusCode).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.results.length).toBeLessThanOrEqual(5);
  });

  test("GET /users/:id returns 200 and the user", async () => {
    const res = await request(app).get(`/users/${userId}`);

    expect(res.statusCode).toBe(200);
    expect((res.body._id || res.body.id).toString()).toBe(userId);
    expect(res.body.email).toContain("@test.com");

    // Ensure password is not exposed
    expect(res.body).not.toHaveProperty("password");
  });
});
