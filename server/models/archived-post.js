import mongoose from 'mongoose';

// Define the schema for the ArchivedPost model
const ArchivedPostSchema = mongoose.Schema({
  // Title of the archived post
  title: {
    type: String,
    required: true,
  },
  // Category of the archived post (optional)
  category: {
    type: String,
    required: false,
  },
  // Body/content of the archived post
  body: {
    type: String,
    required: true,
  },
  // Timestamp indicating when the post was originally created
  createdAt: {
    type: Date,
    default: Date.now, // Default to the current date and time
  },
  // Timestamp indicating when the post was archived
  archivedAt: {
    type: Date,
    default: Date.now, // Default to the current date and time
  },
});

// Create and export the ArchivedPost model based on the defined schema
export default mongoose.model('ArchivedPost', ArchivedPostSchema);
