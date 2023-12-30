import User from '../models/user';

/**
 * Inserts user data into the database.
 *
 * @param {Object} userData - User data to be inserted.
 * @returns {Promise<Object>} - A promise that resolves to the created user object.
 * @throws {Error} - Throws an error if there's an issue creating the user.
 */
export default async function insertUserData(userData) {
  try {
    // Use the User model to create a new user in the database
    return await User.create(userData);
  } catch (error) {
    // Log an error message if there's an issue creating the user
    console.error('Error creating user:', error.message);

    // Re-throw the error to propagate it to the calling code
    throw error;
  }
}
