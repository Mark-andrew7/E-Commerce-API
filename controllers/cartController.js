const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async(req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new cart({ user: req.user.id, items: [], totalPrice: 0 })
        }

        const existingItem = cart.items.find(
            (item) => item.product.id?.tostring() === productId.tostring()
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = existingItem.quantity * product.price;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price: product.price * quantity
            });
        }

        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price, 0);

        await cart.save();

        res.status(200).json(cart);
    } catch(error) {
        res.status(500).json({ error: 'Failed to add item to cart', details: error })
    }
};