const mongoose = require('mongoose');
const validator = require('validator'); // Import validator for email validation

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value); // Validate email format
            },
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Ensure password is at least 6 characters long
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpires: {
        type: Date,
        default: null,
    },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Export the User model
module.exports = mongoose.model('User ', userSchema);