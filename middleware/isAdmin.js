// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const ErrorHandler = require('../utils/ErrorHandler');

async function isAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];

    const token = authHeader;

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);
        const userRole = await User.findById(user._id);
        if (userRole.role != 'admin') {
            return next(new ErrorHandler("admin can only excess", 400))
        }
        req.user = user;
        next();
    });
}

module.exports = isAdmin;
