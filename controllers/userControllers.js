const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const catchAsyncError = require("../middleware/catchAsynError");
const ErrorHandler = require('../utils/ErrorHandler');
const fs = require('fs');
const path = require('path');
const sendEmail = require('../utils/nodeMailer');
const emailOtpMap = {};


exports.register = catchAsyncError(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(new ErrorHandler('please enter credentials', 400));
        }

        const user = await User.findOne({ email: email });
        if (user) {
            return next(new ErrorHandler('User all ready exist', 400));
        }

        const newUser = new User({ name, email, password }).populate('courses');
        await newUser.save();
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.EXPIRE) });
        res.status(200).json({ success: true, user, token, message: 'User registered successfully' });
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

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.EXPIRE) });
        res.status(200).json({ success: true, user, token: token });
    } catch (error) {
        next(error);
    }
});

exports.jwt = catchAsyncError(async (req, res, next) => {
    const userId = req.user._id;
    try {
        const user = await User.findOne({ _id: userId }).populate('courses');
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }
        const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.EXPIRE) });
        res.status(200).json({ success: true, user, token: token });
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
        const user = await User.findByIdAndUpdate(req.user, { name: req.body.name, password: req.body.password })
        res.status(200).json({ success: true, message: "profile updated" });
    } catch (error) {
        next(error);
    }
});

exports.uploadAvatar = catchAsyncError(async (req, res, next) => {
    try {
        var oldAvatar = "";
        const user = await User.findById(req.user._id).select('-password -timestamp');

        if (!user) {
            return next(new ErrorHandler('Invalid UserId', 400));
        }

        if (user.avatar) oldAvatar = user.avatar;
        user.avatar = req.file.path;
        await user.save();
        if (oldAvatar) {
            fs.unlink(oldAvatar, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return;
                }
            })
        }
        res.status(200).json({ success: true, message: "uploadAvatar" });
    } catch (error) {
        next(error);
    }
})

exports.logout = catchAsyncError(async (req, res, next) => {
    try {
        req.user = null;
        res.status(200).json({ success: true, message: "logout" });
    } catch (error) {
        next(error);
    }
})


/* not competed */

exports.enrolledCourses = catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('courses');;
        res.status(200).json({ success: true, courses: user.courses });
    } catch (error) {
        next(error);
    }
})


exports.forgetPasswordMale = catchAsyncError(async (req, res, next) => {
    const email = req.body.email;
    try {
        if (!email) {
            return next(new ErrorHandler('please enter a email', 404));
        }

        const user = await User.findOne({ email }).select('-password -timestamp');

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        emailOtpMap[email] = otp;

        sendEmail(next, "aniketpatidar76@gmail.com", "Forget Password OTP", "OTP is " + otp.toString());

        res.status(200).json({ success: true, message: "send OTP" });

    } catch (error) {
        next(error);
    }
})

exports.changePasswordByOTP = catchAsyncError(async (req, res, next) => {
    const { otp, password, email } = req.body;
    try {
        if (!otp || !password || !email) {
            return next(new ErrorHandler('Please enter cradencials', 400));
        }
        if (emailOtpMap[email] != otp) {
            return next(new ErrorHandler('Invalid OTP', 400));
        }
        const user = await User.findOne({ email });
        user.password = password;
        await user.save();
        delete emailOtpMap[otp];
        res.status(200).json({ success: true, message: "password changed" });
    } catch (error) {
        next(error);
    }
})


exports.dashboard = catchAsyncError(async (req, res, next) => {
    try {
        res.status(200).json({ success: true, message: "user dashboard" });
    } catch (error) {
        next(error);
    }
})
