import { generateRefreshToken, verifyRefreshToken } from '../routes/authMiddleware/generateFreshToken';
import { generateAcessToken, verifyAccessToken } from '../routes/authMiddleware/generateVerifyAccessToken';

export default async function refreshToken(req, res, next) {
  try {
    console.log('now in refreshToken route');
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;

    if (!token || !refreshToken) {
      console.log('Tokens missing');
      return res.redirect('/login');
    }

    const verifiedAccessToken = verifyAccessToken(token);
    console.log('Verified access token: ', verifiedAccessToken);

    // If the access token is expired, try using the refresh token
    if (verifiedAccessToken.error === 'jwt expired') {
      const refreshVerification = verifyRefreshToken(refreshToken);
      console.log('Refresh token verification: ', refreshVerification);

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

      res.cookie('token', newAccessToken, { httpOnly: true });
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

      return res.redirect('/dashboard');
    }
  } catch (error) {
    console.error('Error in refreshToken method', error.message);
    return res.redirect('/login');
  }
}
