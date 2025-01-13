const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let productId; // To store the ID of the product created for testing update and delete

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Close the connection after tests
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Product API", () => {
  
  // Test creating a product
  it("should create a product", async () => {
    const productData = {
      name: "Test Product",
      description: "A description of the test product",
      price: 100,
      category: "electronics",
      stock: 50,
    };
    
    const response = await request(app).post("/api/products").send(productData);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("name", "Test Product");
    productId = response.body.data._id; // Store the product ID for later use
  });

  // Test getting all products (without filters)
  it("should get all products", async () => {
    const response = await request(app).get("/api/products");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  // Test updating a product
  it("should update a product", async () => {
    const updatedProductData = {
      name: "Updated Test Product",
      description: "Updated description",
      price: 120,
    };

    const response = await request(app).put(`/api/products/${productId}`).send(updatedProductData);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe("Updated Test Product");
  });

  // Test deleting a product
  it("should delete a product", async () => {
    const response = await request(app).delete(`/api/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Product deleted successfully");

    // Ensure the product is actually deleted
    const product = await Product.findById(productId);
    expect(product).toBeNull(); // Product should not exist anymore
  });

  // Test getting products with filters (by name)
  it("should get products with name filter", async () => {
    const response = await request(app).get("/api/products?name=Test Product");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  // Test getting products with price range filter
  it("should get products with price filter", async () => {
    const response = await request(app).get("/api/products?price_min=50&price_max=150");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });
});
