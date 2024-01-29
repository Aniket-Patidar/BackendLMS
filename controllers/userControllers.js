const catchAsyncError = require("../middleware/catchAsynError");

exports.home = catchAsyncError(async (req, res, next) => {
    try {
        res.status(200).json("home");
    } catch (error) {
        next(error);
    }
});

exports.login = catchAsyncError(async (req, res, next) => {
    try {
        // Replace `data` with actual data or remove it if not needed
        res.status(200).json("login");
    } catch (error) {
        next(error);
    }
});

exports.register = catchAsyncError(async (req, res, next) => {
    try {
        // Replace `data` with actual data or remove it if not needed
        res.status(200).json("register");
    } catch (error) {
        next(error);
    }
});
