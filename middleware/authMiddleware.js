const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

exports.isAuthenticated = async(req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ succes: false, message: 'Unauthorized access' })
        
        const decoded = jwt.verify(token, Process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) return res.status(401).json({ success:false, message: 'Unautthorized access' })

        next();

        } catch(error) {
        return res.status(401).json({ success: false, message: 'Unauthorized access' })
      }
};


exports.isAdmin = async(req, res, next) => {
    if(!req.user || req.user.role || admin) {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }
    next()
};