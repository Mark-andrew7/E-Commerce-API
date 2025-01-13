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
            cart = new Cart({ user: req.user.id, items: [], totalPrice: 0 });
        }

        const existingItem = cart.items.find(
            (item) => item.product.id?.tostring() === productId.toString()
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


const getCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
        cart = new Cart({ user: userId, items: [], totalPrice: 0 });
        await cart.save();
    }
    return cart;
}

exports.removeItem = async(req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
        const cart = await getCart(userId);
        cart.items = cart.items.filter((item) => item.product._id.tostring() !== productId);
        await cart.updateTotalPrice();

        res.status(200).json({ message: "Item removed from cart", cart });
    } catch(error) {
        res.status(500).json({ message:"Failed to remove item from cart" });
    }
}

exports.updateQuantity = async(req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    try {
        if (quantity <= 0) {
            return res.status(400).json({ error: "Quantity must be greater than zero" });
        }

        const cart = await getCart(userId);

        const cartItem = cart.items.find((item) => item.product._id.tostring() === productId);
        if (!cartItem) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        cartItem.quantity = quantity;
        await cart.updateTotalPrice();

        res.status(200).json({ message: "Item quantity updated", cart });
    } catch(error) {
        res.status(500).json({ error: "Failed to update item quantity" })
    }
};