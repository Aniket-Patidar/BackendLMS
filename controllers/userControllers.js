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
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

exports.register = catchAsyncError(async (req, res, next) => {
    try {
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

