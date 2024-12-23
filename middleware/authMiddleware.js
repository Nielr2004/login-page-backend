const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check JWT token and validate input fields for routes like signup, login, etc.
const authAndValidateInput = (req, res, next) => {
    const path = req.route.path; // Get the route path to customize validation

    // Check JWT token in the Authorization header
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // "Bearer token"

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use environment variable for secret
        req.user = decoded.id; // Attach user id to the request object

        // Input validation based on the route
        switch (path) {
            case '/signup':
                const { name, email, password } = req.body; // Destructure name from request body
                if (!name || !email || !password) {
                    return res.status(400).json({ message: 'Name, email, and password are required' });
                }
                if (!/\S+@\S+\.\S+/.test(email)) {
                    return res.status(400).json({ message: 'Invalid email format' });
                }
                if (password.length < 6) {
                    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
                }
                break;

            case '/login':
                const { email: loginEmail, password: loginPassword } = req.body; // Destructure email from request body
                if (!loginEmail || !loginPassword) {
                    return res.status(400).json({ message: 'Email and password are required' });
                }
                break;

            case '/send-otp':
                const { email: otpEmail } = req.body; // Destructure email for OTP
                if (!otpEmail) {
                    return res.status(400).json({ message: 'Email is required' });
                }
                if (!/\S+@\S+\.\S+/.test(otpEmail)) {
                    return res.status(400).json({ message: 'Invalid email format' });
                }
                break;

            case '/verify-otp':
                const { otp, newPassword } = req.body;
                if (!otp || otp.length !== 6) {
                    return res.status(400).json({ message: 'A valid 6-digit OTP is required' });
                }
                if (!newPassword || newPassword.length < 6) {
                    return res.status(400).json({ message: 'New password must be at least 6 characters long' });
                }
                break;

            default:
                return res.status(400).json({ message: 'Invalid request' });
        }

        // Proceed to the next middleware or controller if everything is valid
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authAndValidateInput;