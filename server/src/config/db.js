const mongoose = require('mongoose');
const env = require('./env');

let memServer;

async function resolveMongoUri() {
  if (env.MONGODB_MEMORY === '1') {
    if (!memServer) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memServer = await MongoMemoryServer.create({
        instance: { launchTimeoutMS: 60000 },
        binary: { version: '8.0.6' },
      });
    }
    return memServer.getUri('build2pitch');
  }
  return env.MONGODB_URI;
}

const connectDB = async () => {
  try {
    const uri = await resolveMongoUri();
    const conn = await mongoose.connect(uri, {
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