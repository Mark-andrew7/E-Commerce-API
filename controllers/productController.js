const Product = require('../models/Product.js')

exports.addProduct = async(req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: true, data: error.message });
    }
};


exports.updateProduct = async(req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!product) return res.status(404).json({ success:false, message:'Product not found' });
        res.status(200).json({ success: true, data: product })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}


exports.deleteProduct  = async(req, res) => {
    try {
        const product = Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found'});
        res.status(200).json({ success:true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ success:false, message: error.message })
    }
}


exports.getProducts = async(req, res) => {
    try {
        const { name, category, price_max, price_min } = req.query

        const query = {} 
        if (name) query.name = { $regex: name, $options: 'i' }
        if (category) query.category = category;
        if (price_min || price_max){
            query.price = {}
            if (price_min) query.price_min.$gte = Number(price_min);
            if (price_max) query.price_max.$lte = Number(price_max);
        }

        const products = await Product.find(query);
        res.status(200).json({ success: true, data: products });
    }  catch(error) {
        res.status(400).json({ success: false, message: error.message })
    }
} 