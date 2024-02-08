const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    instructor: {
        type: String,
        required: [true, 'Instructor name is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required']
    },
    category: {
        type: String,
        enum: ['Programming', 'Design', 'Marketing', 'Business', 'Other'],
        required: [true, 'Category is required']
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: [true, 'Level is required']
    },
    tags: {
        type: [String],
        required: [true, 'At least one tag is required']
    },
    thumbnailPoster: {
        type: String,
        required: [true, 'Thumbnail poster URL is required']
    },
    demoVideoUrl: {
        type: String,
        required: [true, 'Demo video URL is required']
    },
    modules: [
        {
            title: {
                type: String,
                required: [true, 'Module title is required']
            },
            description: {
                type: String,
                required: [true, 'Module description is required']
            },
            videos: [
                {
                    title: {
                        type: String,
                        required: [true, 'Video title is required']
                    },
                    description: {
                        type: String
                    },
                    duration: {
                        type: Number,
                        required: [true, 'Video duration is required']
                    },
                    videoUrl: {
                        type: String,
                        required: [true, 'Video URL is required']
                    }
                }
            ]
        }
    ],
    questions: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            question: {
                type: String,
                required: [true, 'Question is required']
            },
            answer: {
                type: String,
                required: [true, 'Answer is required']
            }
        }
    ],
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                // unique: [true, "Your review is already exists"]
            },
            rating: {
                type: Number,
                min: 1,
                max: 5
            },
            comment: {
                type: String,
                required: [true, 'Review comment is required']
            }
        }
    ],

    Enrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: [true, "you all Ready have this course"]

    }],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Create ID is required']

    }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
