const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

let userToken;

beforeAll(async () => {
  // Create a test user
  const user = await User.create({
    name: "MarkAndrew",
    email: "testuser@example.com",
    password: "password123",
  });
  
  // Generate JWT for user
  userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
});

describe("Authentication", () => {
  test("Should authenticate user and return a JWT", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "testuser@example.com",
        password: "password123",
      });
    
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("Should deny access without valid JWT", async () => {
    const res = await request(app)
      .get("/cart")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
  });
});
