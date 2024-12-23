const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbURI = 'mongodb+srv://roy:Sneh%40shis2004@login-page.x16vg.mongodb.net/login-page?retryWrites=true&w=majority'; // Replace with your connection string
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1); // Exit the process with a failure code
    }
};

module.exports = connectDB;
