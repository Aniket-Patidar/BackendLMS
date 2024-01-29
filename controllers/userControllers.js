const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const catchAsyncError = require("../middleware/catchAsynError");
const ErrorHandler = require('../utils/ErrorHandler');


exports.register = catchAsyncError(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(new ErrorHandler('please enter credentials', 404));
        }

        const user = await User.findOne({ email: email });

        if (user) {
            return next(new ErrorHandler('User all ready exist', 400));
        }



        const newUser = new User({ name, email, password });

        await newUser.save();
        res.status(200).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
});

exports.login = catchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new ErrorHandler('Invalid password', 400));
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: 3600 });
        res.status(200).json({ success: true, token: token });
    } catch (error) {
        next(error);
    }
});

exports.profile = catchAsyncError(async (req, res, next) => {  
    try {
        
        const user = await User.findById(req.user).select('-password -timestamp');
      
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
});

exports.update = catchAsyncError(async (req, res, next) => {
    try {
      
    } catch (error) {
        next(error);
    }
});



