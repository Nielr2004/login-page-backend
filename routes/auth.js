const express = require('express');
const { signup, login, sendOtp, verifyOtp } = require('../controllers/authController'); // Updated forgotPassword to sendOtp
const router = express.Router();

// Input validation middleware
const validateInput = (req, res, next) => {
    const path = req.route.path; // Identify the route path
    const { name, email, password, otp } = req.body; // Destructure fields from request body

    // Validation logic for each route
    switch (path) {
        case '/signup':
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Name, email, and password are required.' });
            }
            if (!/\S+@\S+\.\S+/.test(email)) {
                return res.status(400).json({ error: 'Invalid email format.' });
            }
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
            }
            break;

        case '/login':
            if (!email || !password) { // Changed from name to email for login
                return res.status(400).json({ error: 'Email and password are required.' });
            }
            break;

        case '/send-otp': // Updated route name
            if (!email) {
                return res.status(400).json({ error: 'Email is required.' });
            }
            if (!/\S+@\S+\.\S+/.test(email)) {
                return res.status(400).json({ error: 'Invalid email format.' });
            }
            break;

        case '/verify-otp':
            if (!otp || otp.length !== 6) {
                return res.status(400).json({ error: 'A valid 6-digit OTP is required.' });
            }
            break;

        default:
            return res.status(400).json({ error: 'Invalid request.' });
    }

    next(); // Proceed to the next middleware/controller if validation passes
};

// Authentication routes
router.post('/signup', validateInput, signup);
router.post('/login', validateInput, login);
router.post('/send-otp', validateInput, sendOtp); // Updated route for sending OTP
router.post('/verify-otp', validateInput, verifyOtp); // Route for verifying OTP

module.exports = router;