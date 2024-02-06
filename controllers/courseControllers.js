const catchAsyncError = require("../middleware/catchAsynError");
const Course = require("../models/CourseMode");
const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandler");
const Razorpay = require('razorpay')
const crypto = require('crypto')


exports.Order = catchAsyncError(async (req, res) => {

    const courseId = req.params.id;

    const userId = req.user._id;

    try {

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = req.body;
        const order = await razorpay.orders.create(options);

        if (!order) {
            return next(new ErrorHandler(`Payment failed`, 404));

        }


        const course = await Course.findById(courseId);

        const user = await User.findById(userId);

        if (!course) {
            return next(new ErrorHandler(`Course with ID ${courseId} not found`, 404));
        }

        course.Enrolled.push(userId);
        await course.save();

        user.courses.push(courseId);
        await user.save();

        res.status(200).json({ success: true, message: "you enrolled to course", order });

    }

    catch (err) {
        console.log(err, "Error");
        next(err);
    }

})

exports.review = catchAsyncError(async (req, res) => {
    const { courseID, rating, comment } = req.body;
    console.log();
    const userId = req.user._id;
    try {
        let course = await Course.findById(courseID);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }




        let existingReviewIndex = course.reviews.findIndex(review => {
            const objectIdInstance = review.user
            const objectIdString = objectIdInstance.toString();
            objectIdString === userId
        });


        if (existingReviewIndex !== -1) {
            // Update existing review
            course.reviews[existingReviewIndex].rating = rating;
            course.reviews[existingReviewIndex].comment = comment;
            await course.save();
            return res.status(200).json({ message: 'Review updated successfully' });
        }
        // Create a new review
        const newReview = {
            user: userId,
            rating: rating,
            comment: comment
        }
        course.reviews.push(newReview);
        await course.save();

        return res.status(201).json({ message: 'New review created' });
    } catch (error) {
        console.error('Error submitting review:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

exports.ValidateOrder = catchAsyncError(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    //order_id + "|" + razorpay_payment_id
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if (digest !== razorpay_signature) {
        return res.status(400).json({ msg: "Transaction is not legit!" });
    }

    res.json({
        msg: "success",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
    });
})

exports.getAllCourses = catchAsyncError(async (req, res, next) => {
    try {
        // const courses = await Course.find().populate("Enrolled");
        const courses = await Course.find();
        res.status(200).json({ success: true, courses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        next(error);
    }
});

exports.getByIdCourse = catchAsyncError(async (req, res, next) => {
    const id = req.params.id; // Retrieve the ID from the dynamic route parameter

    try {
        const course = await Course.findById(id).populate("Enrolled");
        if (!course) return next(new ErrorHandler("Course not found", 404)); // Adjust the status code to 404 for "Not Found"
        res.status(200).json({ success: true, course });
    } catch (error) {
        next(error);
    }
});

exports.create = catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(user._id);
        if (!user) return next(new ErrorHandler("User not found", 404));
        const course = await Course.create({ ...req.body, createdBy: req.user._id });
        if (!user) return next(new ErrorHandler("Course creation failed", 404));
        user.courses.push(course._id);
        await user.save();
        res.status(200).json({ success: true, course });
    } catch (error) {
        next(error);
    }
});

exports.update = catchAsyncError(async (req, res, next) => {
    try {
        const courseID = req.params.id;

        let course = await Course.findById(courseID);

        if (req.user._id != course.createdBy) {
            return next(new ErrorHandler("You do not have permission to access and modify this course"));
        }

        course = await Course.findByIdAndUpdate(courseID, req.body, { new: true });

        res.status(200).json({ success: true, course });
    } catch (error) {
        next(error);
    }
});

exports.Delete = catchAsyncError(async (req, res, next) => {
    try {
        const courseID = req.params.id;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new ErrorHandler(`Course with ID ${courseId} not found`, 404));
        }

        if (req.user._id !== course.createdBy.toString()) {
            return next(new ErrorHandler("You do not have permission to delete this course", 403));
        }

        await Course.findByIdAndDelete(courseId);

        res.status(200).json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        next(error);
    }
});

exports.enrolledCourse = catchAsyncError(async (req, res, next) => {

    const courseId = req.body.courseId;

    const userId = req.user._id;

    try {

        const course = await Course.findById(courseId);
        const user = await User.findById(userId);

        if (!course) {
            return next(new ErrorHandler(`Course with ID ${courseId} not found`, 404));
        }

        course.Enrolled.push(userId);
        await course.save();

        user.courses.push(courseId);
        await user.save();

        res.status(200).json({ success: true, message: `you Enrolled to course  ${course.title}` });
    } catch (error) {
        console.error("Error deleting course:", error);
        next(error);
    }
});


