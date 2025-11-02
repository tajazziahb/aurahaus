require('dotenv').config();
const mongoose = require('mongoose');

async function connectToMongo() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME || 'aurahaus';
    if (!uri) throw new Error('MONGODB_URI is not set');

    await mongoose.connect(uri, {
        dbName,
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000
    });

    console.log(`✅ Connected to MongoDB: ${dbName}`);
    return mongoose.connection; 
}

module.exports = connectToMongo;