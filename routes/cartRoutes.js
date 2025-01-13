const express = require("express");
const { removeItem, updateQuantity } = require("../controllers/cartController.js");
const { isAuthenticated } = require("../middleware/authMiddleware.js");


const router = express.Router();

router.delete("/cart/:productId", isAuthenticated, removeItem);
router.patch("/cart/:productId", isAuthenticated, updateQuantity);

