const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signup = async(req, res) => {
    const { name, email, password } = req.body;

    try{
        const user = await User.create({ name, email, password });
        res.status(201).json({message: 'User created successfully, user'})
    } catch {
        res.status(400).json({message: error.message})
    }
}

const login = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({message: 'User not found'})

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json({message: 'Invalid credentials'})

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({ token });
   } catch (error) {
        res.status(500).json({ message: error.message})
   }
}

module.exports = { signup, login }