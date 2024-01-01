import mongoose from 'mongoose';

const CommentSchema = mongoose.Schema({
  // Author of thecomment
  author: {
    type: String,
    required: true,
  },
  // Content/Body of the comment
  content: {
    type: String,
    required: true,
  },
  // TimeStamp indicating when the comment was created
  createAt: {
    type: Date,
    default: Date.now, // Default to the current date and time
  },
});

export default CommentSchema;
