import mongoose from 'mongoose';
import dotenv from 'dotenv';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return { db: mongoose.connection.db, gfs: mongoose.connection.gfs };

  dotenv.config();

  const MONGO_URI = process.env.MONGODB_URI;
  
  if (!MONGO_URI) {
    throw new Error('MongoDB URI not found in environment variables');
  }

  await mongoose.connect(MONGO_URI);

  const db = mongoose.connection.db;

  return db;
};

export default connectToDatabase;
