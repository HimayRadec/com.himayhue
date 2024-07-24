import mongoose from 'mongoose';

// MongoDB connection
export async function connectToMongoDB() {
   try {
      const mongoDBConnection = await mongoose.connect(String(process.env.MONGODB_URI))
      console.log('MongoDB connected');
      return mongoDBConnection;
   }
   catch (error) {
      throw new Error('Error connecting to MongoDB: ' + error);
   }
}
