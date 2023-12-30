import mongoose from 'mongoose';

// Define the schema for the User model
const Userschema = mongoose.Schema({
  // First name of the user
  firstname: {
    type: String,
    required: true,
  },
  // Last name of the user
  lastname: {
    type: String,
    required: true,
  },
  // Unique username for the user
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // Unique email address for the user
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Hashed password for authentication
  hashedPassword: {
    type: String,
    required: true,
  },
  // Another hashed password field (you might want to clarify its purpose)
  hashedPassword2: {
    type: String,
    required: true,
  },
});

// Create and export the User model based on the defined schema
export default mongoose.model('User', Userschema);
