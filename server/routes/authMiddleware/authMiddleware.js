import jwt from 'jsonwebtoken';
import { generateRefreshToken, verifyRefreshToken } from './generateFreshToken';
import { generateAcessToken, verifyAccessToken } from './generateVerifyAccessToken';

/**
 * authenticationMiddleware
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export default function authenticationMiddleware(req, res, next) {
  // Token for authentication
  const { token } = req.cookies;

  // refreshToken for refreshing tokens when token expires
  const { refreshToken } = req.cookies;

  if (!token) {
    console.error('token not present');
    // Redirect to login page
    return res.redirect('/login');
  }
  if ((!token && !refreshToken)) {
    // Redirect to login page
    return res.redirect('/login');
  }

  try {
    if (token) {
      const decodedToken = verifyAccessToken(token);
      if (!decodedToken.success) {
        return res.redirect('/refresh');
      }
      console.log('from authenticationMiddleware decodedToken : ', decodedToken);
      next();
    } else if (refreshToken) {
      const refreshVerification = verifyRefreshToken(refreshToken);

      if (refreshVerification.success) {
        const freshAccessToken = generateRefreshToken(refreshVerification.data);
        const newAccessToken = generateAcessToken(refreshVerification.data);

        res.cookie('refreshToken', freshAccessToken);
        res.cookie('token', newAccessToken);

        next();
      } else {
        // Redirect to login page or handle unauthorized access
        return res.redirect('/login');
      }
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // console.log('token expired in authenticationMiddleware: ', JSON.stringify(error.message));
      return res.redirect('/refresh');
    }
    // console.error('Error in authenticationMiddleware: ', JSON.stringify(error.message));
    // next(error);
    // Return to login page
    return res.redirect('/login');
  }
}
