const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.schema.types.ObjectId,
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
        type: mongoose.schema.types.ObjectId,
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

Module.exports = mongoose.model('Cart', CartSchema)