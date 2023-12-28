import mongoose from 'mongoose';

const ArchivedPostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('ArchivedPost', ArchivedPostSchema);
