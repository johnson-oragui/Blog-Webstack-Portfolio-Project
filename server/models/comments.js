import mongoose from 'mongoose';

const ReplySchema = mongoose.Schema({
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
  replies: [ // for nested replies
    {
      type: ReplySchema,
      required: false,
    },
  ],
});

export default CommentSchema;
