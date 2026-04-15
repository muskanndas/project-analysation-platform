import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected`);
    
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

mongoose.connection.on('error', (err) => {
  console.error(' MongoDB Error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB Disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log(' MongoDB connection closed through app termination');
  process.exit(0);
});
