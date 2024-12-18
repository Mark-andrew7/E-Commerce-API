const express = require('express');
const {
    addProduct,
    updateProduct,
    deleteProduct,
    getProducts
} = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

const router = express.router();

router.post('/products', isAuthenticated, isAdmin, addProduct);
router.put('/products/:id', isAuthenticated, isAdmin, updateProduct);
router.delete('/products/:id', isAuthenticated, isAdmin, deleteProduct);

router.get('/products', getProducts);

Module.exports = router;