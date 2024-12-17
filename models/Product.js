const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    stock: { number: true },
    images: [{ type: String }]
}, {
    timestamps: true
});

const Product = mongoose.model('Puppy', productSchema);

Module.exports = Product;