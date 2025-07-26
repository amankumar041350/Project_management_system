import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI)
async function dbConnect() {
  if (mongoose.connection.readyState === 1) {
    console.log("already connected")
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

export default dbConnect;
