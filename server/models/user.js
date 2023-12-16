import mongoose from 'mongoose';

const Userschema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  hashedPassword2: {
    type: String,
    required: true,
  },
});

export default mongoose.model('User', Userschema);
