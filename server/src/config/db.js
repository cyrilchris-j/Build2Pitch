const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB at ${env.MONGODB_URI}`);
    console.warn(`[Database Warning] Details: ${error.message}`);
    console.warn(`[Database Warning] Server will run in degraded/mock mode until database is available.`);
    return null;
  }
};

module.exports = connectDB;
