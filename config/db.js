const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config('../.env')
const mongoURL = process.env.mongoURL;

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log(`MongoDB connected`);
    } catch (error) {
        console.error(`Error connecting to MongoDB ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;
