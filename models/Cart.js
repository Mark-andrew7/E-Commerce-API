const mongoose = require('mongoose');
const User = require("./User");

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        min: 1
    }
});


const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    items: [CartItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    }
});


CartSchema.methods.updateTotalPrice = function() {
    this.totalPrice = this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    return this.save();
}

module.exports = mongoose.model('Cart', CartSchema)