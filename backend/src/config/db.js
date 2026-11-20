import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lead_manager';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.warn(`[Database] Could not connect to configured MongoDB URI (${uri}): ${err.message}`);
    
    // Automatic fallback to mongodb-memory-server for instant zero-configuration local review/development
    try {
      console.log('[Database] Starting in-memory MongoDB fallback...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to In-Memory MongoDB successfully at ${memoryUri}`);

      process.on('SIGINT', async () => {
        await mongoose.disconnect();
        await mongod.stop();
        process.exit(0);
      });
    } catch (memErr) {
      console.error('[Database] Failed to initialize in-memory fallback:', memErr.message);
      console.error('[Database] Please provide a valid MONGODB_URI in backend/.env');
      process.exit(1);
    }
  }
};

export default connectDB;
