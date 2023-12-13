import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database connected: ${conn.connect.name}`);
  } catch (error) {
    console.error(`Error connecting to ${process.env.MONGODB_URI}`, error.message);
  }
};

export default dbConnect;
