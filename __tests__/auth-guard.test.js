const request = require("supertest");
const app = require("../app");

describe("Auth guard (no DB routes)", () => {
  test("private route should be 401 when logged out", async () => {
    const res = await request(app).get("/__test__/private");
    expect(res.statusCode).toBe(401);
  });

  test("private route should work when test-auth header set", async () => {
    const res = await request(app).get("/__test__/private").set("x-test-auth", "1");
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test("public route should be accessible without auth", async () => {
    const res = await request(app).get("/__test__/public");
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
