const catchAsyncError = require("../middleware/catchAsynError");

exports.home = catchAsyncError(async (req, res, next) => {
    try {
        res.status(200).json("home");
    } catch (error) {
        next(error);
    }
});