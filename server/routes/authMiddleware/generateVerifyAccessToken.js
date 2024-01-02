import jwt from 'jsonwebtoken';

/**
 * Generates a new access token.
 *
 * @param {Object} user - The user object containing id and username.
 * @returns {string} - The generated access token.
 */
export function generateAcessToken(user) {
  const payload = {
    id: user._id,
    username: user.username,
  };

  const options = {
    expiresIn: '1h', // Expires in 1 hour
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  };

  const secretKey = process.env.ACCESS_TOKEN_SECRET;

  const token = jwt.sign(payload, secretKey, options);
  return token;
}

/**
 * Verifies an access token.
 *
 * @param {string} token - The access token to verify.
 * @returns {Object} - An object indicating success or failure along with decoded data.
 */
export function verifyAccessToken(token) {
  try {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;

    // Verify the access token with the secret key, and additional options
    const decoded = jwt.verify(token, secretKey, {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    });

    return { success: true, data: decoded };
  } catch (error) {
    // console.error('Error verifying access token:', error.message);
    return { success: false, error: error.message };
  }
}
