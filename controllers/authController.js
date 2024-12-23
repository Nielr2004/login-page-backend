const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Secret Key for JWT
const JWT_SECRET = 'YOUR_SECRET_KEY'; // Replace with a strong secret key

// Nodemailer Transporter (configure with your email service)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Example: Gmail
    auth: {
        user: 'your-email@gmail.com', // Your email address
        pass: 'your-email-password', // Your email password
    },
});

// Signup
exports.signup = async (req, res) => {
    const { name, email, password } = req.body; // Destructure name from request body

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    try {
        // Check if user already exists
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User  created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body; // Destructure email from request body

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Validate input
    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP and expiration in the database
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes
        await user.save();

        // Send OTP via email
        await transporter.sendMail({
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP is ${otp}`,
        });

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Email, OTP, and new password are required.' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Reset password
        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = undefined; // Clear OTP
        user.otpExpires = undefined; // Clear OTP expiration
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};