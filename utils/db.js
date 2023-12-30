import mongoose from 'mongoose';

/**
 * Connects to the MongoDB database using Mongoose.
 */
const dbConnect = async () => {
  try {
    // Set strictQuery to false to disable strict mode (optional)
    mongoose.set('strictQuery', false);

    // Connect to the MongoDB database using the URI from the environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // Log a success message when the connection is established
    console.log(`Database connected: ${conn.connection.name}`);
  } catch (error) {
    // Log an error message if there's an issue connecting to the database
    console.error(`Error connecting to ${process.env.MONGODB_URI}`, error.message);
  }
};

export default dbConnect;
