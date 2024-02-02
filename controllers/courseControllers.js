const catchAsyncError = require("../middleware/catchAsynError");
const Course = require("../models/CourseMode");
const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandler");



exports.getAllCourses = catchAsyncError(async (req, res, next) => {
    try {
        const courses = await Course.find().populate("Enrolled");

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

    req.body = {
        "title": "Mern Stack complete",
        "description": "Learn Mern Stack programming from scratch to advanced concepts.",
        "instructor": "Aniket Patidar",
        "price": 999.99,
        "duration": 80,
        "category": "Programming",
        "level": "Intermediate",
        "tags": ["Mern Stack", "Web Development", "Programming"],
        "thumbnailPoster": "/uploads/58642e744c2d0434097e5ab2.jpg",
        "demoVideoUrl": "/uploads/lesson1.mp4",
        "modules": [
            {
                "title": "Introduction to Mern Stack",
                "description": "This module covers the basics of Mern Stack.",
                "videos": [
                    {
                        "title": "Variables and Data Types",
                        "description": "Learn about variables and different data types in Mern Stack.",
                        "duration": 10,
                        "videoUrl": "/uploads/lesson1.mp4"
                    },
                    {
                        "title": "Functions and Scope",
                        "description": "Understand functions and scope in Mern Stack.",
                        "duration": 15,
                        "videoUrl": "/uploads/lesson1.mp4"
                    }
                ]
            },
            {
                "title": "Intermediate Mern Stack",
                "description": "This module covers more advanced Mern Stack topics.",
                "videos": [
                    {
                        "title": "Arrays and Objects",
                        "description": "Explore arrays and objects in Mern Stack.",
                        "duration": 20,
                        "videoUrl": "/uploads/lesson1.mp4"
                    },
                    {
                        "title": "DOM Manipulation",
                        "description": "Learn how to manipulate the DOM using Mern Stack.",
                        "duration": 25,
                        "videoUrl": "/uploads/lesson1.mp4"
                    }
                ]
            }
        ],
    }

    try {
        const course = await Course.create({ ...req.body, createdBy: req.user._id });
        res.status(200).json({ success: true, course });
    } catch (error) {
        next(error);
    }
});

exports.update = catchAsyncError(async (req, res, next) => {
    try {
        const courseId = req.params.id;

        let course = await Course.findById(courseId);

        if (req.user._id != course.createdBy) {
            return next(new ErrorHandler("You do not have permission to access and modify this course"));
        }

        course = await Course.findByIdAndUpdate(courseId, req.body, { new: true });

        res.status(200).json({ success: true, course });
    } catch (error) {
        next(error);
    }
});

exports.Delete = catchAsyncError(async (req, res, next) => {
    try {
        const courseId = req.params.id;

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



/* 
"questions": [
    {
        "user": "65b773726772824a42d63e06",
        "question": "How do you declare a variable in JavaScript?",
        "answer": "You can declare a variable using the 'var', 'let', or 'const' keywords."
    },
    {
        "user": "65b8937565fde9b8e9917dea",
        "question": "What is a closure in JavaScript?",
        "answer": "A closure is a function defined within another function and has access to the outer function's scope."
    }
],
"reviews": [
    {
        "user": "65b8937565fde9b8e9917dea",
        "rating": 4,
        "comment": "Great course, covers a wide range of topics!"
    },
    {
        "user": "65b773726772824a42d63e06",
        "rating": 5,
        "comment": "Excellent content and explanations. Highly recommended!"
    }
] */