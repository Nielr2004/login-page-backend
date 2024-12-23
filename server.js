const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Hardcode MongoDB URI and JWT Secret here
const MONGO_URI = 'mongodb+srv://roy:<Sneh@shis2004>@login-page.x16vg.mongodb.net/login-page?retryWrites=true&w=majority'; // Replace with your MongoDB connection string
const JWT_SECRET = 'your-secret-key'; // Replace with a secure secret key

// Connect to the database
connectDB(MONGO_URI);

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes); // Authentication routes

// Start the server
const PORT = 5000; // Hardcoded port value
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
