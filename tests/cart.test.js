const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");

let userToken;
let productId;
let cartId;

beforeAll(async () => {
  // Create a test user
  const user = await User.create({
    email: "testuser@example.com",
    password: "password123",
  });
  
  // Generate JWT for user
  userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Create a test product
  const product = await Product.create({
    name: "Test Product",
    price: 100,
    description: "A product for testing",
  });
  
  productId = product._id;

  // Create a cart for the user
  const cart = await Cart.create({
    user: user._id,
    items: [{ product: product._id, quantity: 1 }],
    totalPrice: 100,
  });
  
  cartId = cart._id;
});

describe("Cart API", () => {
  // Test for adding an item to the cart
  test("Should add a product to the cart", async () => {
    const res = await request(app)
      .post("/cart/add-item")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ productId, quantity: 2 });
    
    expect(res.status).toBe(200);
    expect(res.body.cart.items).toHaveLength(1);
    expect(res.body.cart.items[0].quantity).toBe(2);
    expect(res.body.cart.totalPrice).toBe(200);
  });

  // Test for removing an item from the cart
  test("Should remove a product from the cart", async () => {
    const res = await request(app)
      .delete(`/cart/remove-item/${productId}`)
      .set("Authorization", `Bearer ${userToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.cart.items).toHaveLength(0);
    expect(res.body.cart.totalPrice).toBe(0);
  });

  // Test for updating the quantity of an item
  test("Should update the quantity of an item", async () => {
    // Add product back to the cart for testing update
    await request(app)
      .post("/cart/add-item")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ productId, quantity: 1 });
    
    const res = await request(app)
      .patch(`/cart/update-quantity/${productId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 5 });
    
    expect(res.status).toBe(200);
    expect(res.body.cart.items[0].quantity).toBe(5);
    expect(res.body.cart.totalPrice).toBe(500);
  });

  // Test for viewing the cart
  test("Should get the user's cart", async () => {
    const res = await request(app)
      .get("/cart")
      .set("Authorization", `Bearer ${userToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.cart.items).toHaveLength(1);
    expect(res.body.cart.totalPrice).toBe(500);
  });
});
