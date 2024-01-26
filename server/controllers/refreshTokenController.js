import { generateRefreshToken, verifyRefreshToken } from '../routes/tokenHelpers/generateFreshToken';
import { generateAcessToken, verifyAccessToken } from '../routes/tokenHelpers/generateVerifyAccessToken';

/**
 * @description Middleware to refresh the user's access token using the refresh token
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
export default async function refreshToken(req, res, next) {
  try {
    // Extract tokens from cookies
    const { token } = req.cookies;
    const { refreshToken } = req.cookies;

    // Check if tokens are missing
    if (!token || !refreshToken) {
      console.error('Tokens missing');
      return res.redirect('/login');
    }

    // Verify the access token
    const verifiedAccessToken = verifyAccessToken(token);

    // If the access token is expired, try using the refresh token
    if (verifiedAccessToken.error === 'jwt expired') {
      // Verify the refresh token
      const refreshVerification = verifyRefreshToken(refreshToken);

      // If refresh token verification fails
      if (!refreshVerification.success) {
        console.error('Refresh token verification failed');
        // clear the token
        res.clearCookie('token');
        // clear refreshToken
        res.clearCookie('refreshToken');
        // redirect to login
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

      // Set the new tokens as cookies
      res.cookie('token', newAccessToken);
      res.cookie('refreshToken', newRefreshToken);

      // Redirect to the dashboard with the new tokens
      return res.redirect('/dashboard');
    }
  } catch (error) {
    // Handle errors and redirect to login
    // console.error('Error in refreshToken method', error.message);
    return res.redirect('/login');
  }
}
