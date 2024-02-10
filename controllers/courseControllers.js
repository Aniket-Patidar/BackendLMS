const catchAsyncError = require("../middleware/catchAsynError");
const Course = require("../models/CourseMode");
const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandler");
const Razorpay = require('razorpay')
const crypto = require('crypto');
const sendEmail = require("../utils/nodeMailer");


// exports.Order = catchAsyncError(async (req, res, next) => {
//     const courseId = req.params.id;
//     const userId = req.user._id;

//     try {
//         const course = await Course.findById(courseId);
//         const user = await User.findById(userId);

//         if (!course) {
//             return next(new ErrorHandler(`Course with ID ${courseId} not found`, 404));
//         }

//         if (!user) {
//             return next(new ErrorHandler('User not found', 404));
//         }

//         if (course.Enrolled.includes(user._id)) {
//             return next(new ErrorHandler(`User is already enrolled in the course ${course.title}`, 400));
//         }

//         const razorpay = new Razorpay({
//             key_id: process.env.RAZORPAY_KEY_ID,
//             key_secret: process.env.RAZORPAY_SECRET,
//         });

//         const options = req.body;
//         const order = await razorpay.orders.create(options);

//         if (!order) {
//             return next(new ErrorHandler(`Payment failed`, 400));
//         }

//         res.status(200).json({ success: true, order });
//     } catch (err) {
//         console.log(err, "Error");
//         next(err);
//     }
// });

// exports.ValidateOrder = catchAsyncError(async (req, res, next) => {
//     const courseId = req.params.id;
//     const userId = req.user._id;

//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//         const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
//         sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
//         const digest = sha.digest("hex");




//         if (digest !== razorpay_signature) {

//             return res.status(400).json({ msg: "Transaction is not legitimate!" });
//         }


//         const course = await Course.findById(courseId);
//         const user = await User.findById(userId);

//         if (!course) {
//             return next(new ErrorHandler(`Course with ID ${courseId} not found`, 404));
//         }

//         if (!user) {
//             return next(new ErrorHandler('User not found', 404));
//         }

//         course.Enrolled.push(userId);
//         await course.save();

//         user.courses.push(courseId);
//         await user.save();


//         res.json({
//             msg: "success",
//             orderId: razorpay_order_id,
//             paymentId: razorpay_payment_id,
//         });


//     } catch (err) {
//         console.log(err, "Error");
//         next(err);
//     }


// });




exports.Order = catchAsyncError(async (req, res) => {

    const courseId = req.params.id;

    const userId = req.user._id;

    try {


        const course = await Course.findById(courseId);

        const user = await User.findById(userId);

        if (!course) {
            return next(new ErrorHandler(`Course with ID ${courseId} not found`, 404));
        }


        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        if (course.Enrolled.includes(user._id)) {
            return next(new ErrorHandler(`This course is already in the course collection ${course.title}`, 400));
        }

        if (user.courses.includes(course._id)) {
            return next(new ErrorHandler(`This course is already in the course collection ${course.title}`, 400));
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = req.body;
        const order = await razorpay.orders.create(options);

        if (!order) {
            return next(new ErrorHandler(`Payment failed`, 404));

        }

        /* course */



        if (!course) {
            return next(new ErrorHandler(`Course with ID ${courseId} not found`, 404));
        }

        course.Enrolled.push(userId);
        await course.save();

        user.courses.push(courseId);
        await user.save();



        res.status(200).json({ success: true, order });
    }

    catch (err) {
        console.log(err, "Error");
        next(err);
    }

})


exports.ValidateOrder = catchAsyncError(async (req, res) => {

    const courseId = req.params.id;

    const userId = req.user._id;
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;
        const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
        //order_id + "|" + razorpay_payment_id
        sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = sha.digest("hex");
        if (digest !== razorpay_signature) {
            return res.status(400).json({ msg: "Transaction is not legit!" });
        }



        /* enrollment */


        res.json({
            msg: "success",
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
        });

    } catch (err) {
        console.log(error, "payment vari");
        next(err);
    }

})


exports.review = catchAsyncError(async (req, res) => {
    const { courseID, rating, comment } = req.body;
    const userId = req.user._id;
    try {
        let course = await Course.findById(courseID);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const newReview = {
            user: userId,
            rating: rating,
            comment: comment
        }


        const filterArray = course.reviews.filter(review => review.user != userId);
        await filterArray.push(newReview);

        course.reviews = filterArray;

        // calculating rating ;

        const totalReviews = course.reviews.length;
        if (totalReviews != 0) {
            const sumOfRatings = course.reviews.reduce((acc, review) => acc + review.rating, 0);
            course.rating = sumOfRatings / totalReviews;
        }
        await course.save();


        return res.status(201).json({ message: 'New review created' });
    } catch (error) {
        console.error('Error submitting review:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
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
        const course = await Course.findById(id).populate("Enrolled").populate("reviews.user")
        if (!course) return next(new ErrorHandler("Course not found", 404)); // Adjust the status code to 404 for "Not Found"
        res.status(200).json({ success: true, course });
    } catch (error) {
        next(error);
    }
});

exports.create = catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return next(new ErrorHandler("User not found", 404));
        const course = await Course.create({ ...req.body, createdBy: req.user._id });

        if (!course) return next(new ErrorHandler("Course creation failed", 404));
        user.courses.push(course._id);
        course.createdBy = user.id;
        await user.save();
        await course.save();
        res.status(200).json({ success: true, course, user });
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




exports.question = catchAsyncError(async (req, res, next) => {

    const { question, courseId } = req.body;

    const userId = req.user._id;

    try {

        const course = await Course.findById(courseId);
        const user = await User.findById(userId);

        if (!course) {
            return next(new ErrorHandler(`Course with ID ${courseId} not found`, 404));
        }


        course.questions.push({ user: userId, question: question });
        await course.save();


        res.status(200).json({ success: true, message: ` your doutes have resolve soon` });
    } catch (error) {
        next(error);
    }
});



exports.answer = catchAsyncError(async (req, res, next) => {

    const { answer, courseId, questionId } = req.body;

    const userId = req.user._id;

    try {

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new ErrorHandler(`Course with ID ${courseId} not found`, 404));
        }

        
        const index = course.questions.findIndex(e => e.id == questionId);
        
        
        course.questions[index].answer = answer || "answer";
        await course.save();

        
        res.status(200).json({ success: true, message: `answer is uploaded` });
    } catch (error) {
        next(error);
    }
});
