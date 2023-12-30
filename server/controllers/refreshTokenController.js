import { generateRefreshToken, verifyRefreshToken } from '../routes/authMiddleware/generateFreshToken';
import { generateAcessToken, verifyAccessToken } from '../routes/authMiddleware/generateVerifyAccessToken';

/**
 * @description Middleware to refresh the user's access token using the refresh token
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
export default async function refreshToken(req, res, next) {
  try {
    // Extract tokens from cookies
    const { token } = req.cookies.token;
    const { refreshToken } = req.cookies.refreshToken;

    // Check if tokens are missing
    if (!token || !refreshToken) {
      console.log('Tokens missing');
      return res.redirect('/login');
    }

    // Verify the access token
    const verifiedAccessToken = verifyAccessToken(token);
    console.log('Verified access token: ', verifiedAccessToken);

    // If the access token is expired, try using the refresh token
    if (verifiedAccessToken.error === 'jwt expired') {
      // Verify the refresh token
      const refreshVerification = verifyRefreshToken(refreshToken);
      console.log('Refresh token verification: ', refreshVerification);

      // If refresh token verification fails, redirect to login
      if (!refreshVerification.success) {
        console.log('Refresh token verification failed');
        return res.redirect('/login');
      }

      // Generate new tokens using refresh token data
      const newAccessToken = generateAcessToken({
        id: refreshVerification.data.id,
        username: refreshVerification.data.username,
      });
      const newRefreshToken = generateRefreshToken({
        id: refreshVerification.data.id,
        username: refreshVerification.data.username,
      });

      console.log('New access token: ', newAccessToken);
      console.log('New refresh token: ', newRefreshToken);

      // Set the new tokens as cookies
      res.cookie('token', newAccessToken, { httpOnly: true });
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

      // Redirect to the dashboard with the new tokens
      return res.redirect('/dashboard');
    }
  } catch (error) {
    // Handle errors and redirect to login
    console.error('Error in refreshToken method', error.message);
    return res.redirect('/login');
  }
}
