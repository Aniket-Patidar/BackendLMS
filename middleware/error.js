// errorMiddleware.js

const ErrorHandler = require("../utils/ErrorHandler");

function errorMiddleware(err, req, res, next) {
    console.error(err.stack);

    if (err.name === 'CastError') {
        const message = 'Invalid ID'
        err = new ErrorHandler(message, 400)
    }

    if (err.code === 11000 && err.name === 'MongoError') {
        const message = 'Duplicate Key Error'
        err = new ErrorHandler(message, 400)
    }

    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid JWT Token'
        err = new ErrorHandler(message, 400)
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'JWT Token Expired'
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}

module.exports = errorMiddleware;
