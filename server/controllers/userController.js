import User from '../models/user';

export default async function insertUserData(userData) {
  try {
    return await User.create(userData);
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
}
