// config/database.js
require('dotenv').config();
const mongoose = require('mongoose');

async function connectToMongo() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME || 'budgetbuddy',
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB connected successfully.');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
    }
}

module.exports = connectToMongo;