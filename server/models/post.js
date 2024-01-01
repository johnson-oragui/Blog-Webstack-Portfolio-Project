import mongoose from 'mongoose';
import CommentSchema from './comments';

// Define the schema for the Post model
const PostSchema = mongoose.Schema({
  // Title of the post
  title: {
    type: String,
    required: true,
  },
  // Category of the post (optional)
  category: {
    type: String,
    required: false,
  },
  // Body/content of the post
  body: {
    type: String,
    required: true,
  },
  // Timestamp indicating when the post was originally created
  createdAt: {
    type: Date,
    default: Date.now, // Default to the current date and time
  },
  // Timestamp indicating when the post was last updated
  updatedAt: {
    type: Date,
    default: Date.now, // Default to the current date and time
  },
  // Comments associated with the post
  comments: [
    {
      type: CommentSchema,
      required: false,
    },
  ],
});

// Create and export the Post model based on the defined schema
export default mongoose.model('Post', PostSchema);
