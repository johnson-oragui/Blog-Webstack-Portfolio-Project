import jwt from 'jsonwebtoken';

/**
 * Generates a new refresh token.
 *
 * @param {Object} user - The user object containing id and username.
 * @returns {string} - The generated refresh token.
 */
export function generateRefreshToken(user) {
  // Define the payload for the refresh token
  const payload = {
    id: user._id,
    username: user.username,
  };

  // Define options for the refresh token
  const options = {
    expiresIn: '7d', // Expires in 7 days
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  };

  // Retrieve the secret key for the refresh token from environment variables
  const secretKey = process.env.FRESH_TOKEN_SECRET;

  // Sign the refresh token with the payload, secret key, and options
  const freshToken = jwt.sign(payload, secretKey, options);

  console.log('freshToken from generateRefreshToken', freshToken);
  return freshToken;
}

/**
 * Verifies a refresh token.
 *
 * @param {string} token - The refresh token to verify.
 * @returns {Object} - An object indicating success or failure along with decoded data.
 */
export function verifyRefreshToken(token) {
  try {
    // Retrieve the secret key for the refresh token from environment variables
    const secretKey = process.env.FRESH_TOKEN_SECRET;

    // Verify the refresh token with the secret key, and additional options
    const decoded = jwt.verify(token, secretKey, {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    });

    console.log('decoded from verifyRefreshToken', decoded);
    return { success: true, data: decoded };
  } catch (error) {
    console.error('error in verifyRefreshToken', error.message);
    return { success: false, error: error.message };
  }
}
