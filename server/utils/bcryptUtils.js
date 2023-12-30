import bcrypt from 'bcrypt';

/**
 * Hashes a plain text password using bcrypt.
 *
 * @param {string} plainPassword - The plain text password to be hashed.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 * @throws {Error} - Throws an error if there's an issue hashing the password.
 */
export async function hashedPwd(plainPassword) {
  try {
    // Generate a salt with 10 rounds
    const salt = await bcrypt.genSalt(10);

    // Hash the plain password with the generated salt
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    return hashedPassword;
  } catch (error) {
    // Log an error message if there's an issue hashing the password
    console.error('Error hashing password:', error.message);

    // Re-throw the error to propagate it to the calling code
    throw error;
  }
}

/**
 * Compares a plain text password with a hashed password using bcrypt.
 *
 * @param {string} plainPassword - The plain text password to be compared.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the passwords match.
 * @throws {Error} - Throws an error if there's an issue comparing the passwords.
 */
export async function checkHashedPwd(plainPassword, hashedPassword) {
  try {
    // Compare the plain password with the hashed password
    const match = await bcrypt.compare(plainPassword, hashedPassword);

    return match;
  } catch (error) {
    // Log an error message if there's an issue comparing the passwords
    console.error('Error comparing passwords:', error.message);

    // Re-throw the error to propagate it to the calling code
    throw error;
  }
}
