const request = require("supertest");
const app = require("../app");

describe("Root route", () => {
  test("GET / returns Logged out by default", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Logged out");
  });

  test("GET / returns logged in message when test auth header set", async () => {
    const res = await request(app).get("/").set("x-test-auth", "1");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("You are logged in");
    expect(res.text).toContain("testuser");
  });

    test("GET /__test__/private should work when test-auth header set", async () => {
        const res = await request(app).get("/__test__/private").set("x-test-auth", "1");
        expect(res.statusCode).toBe(200);
        expect(res.body.ok).toBe(true);
    });


});
