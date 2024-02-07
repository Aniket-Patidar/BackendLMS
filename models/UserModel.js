const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    avatar: {
        type: String,
        // required: [true, 'Avatar is required']
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        required: [true, 'Verification status is required'],
        default: false
    },
    // courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

        createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        unique: [true, "you all Ready created this course"]
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};


const User = mongoose.model('User', userSchema);

module.exports = User;
