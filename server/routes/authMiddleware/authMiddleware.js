import jwt from 'jsonwebtoken';
import { generateRefreshToken, verifyRefreshToken } from './generateFreshToken';
import { generateAcessToken, verifyAccessToken } from './generateVerifyAccessToken';

export default function authenticationMiddleware(req, res, next) {
  // Token for authentication
  const { token } = req.cookies;
  console.log('token from AuthMiddleware: ', token);

  // refreshToken for refreshing tokens when token expires
  const { refreshToken } = req.cookies;
  console.log('refreshToken from AuthMiddleware: ', refreshToken);
  console.log('req.cookies from AuthMiddleware: ', req.cookies);

  if (!token) {
    console.log('token not present');
    // Redirect to login page
    return res.redirect('/login');
  }
  if ((!token && !refreshToken)) {
    console.log('refreshToken not present');
    // Redirect to login page
    return res.redirect('/login');
  }

  try {
    if (token) {
      const decodedToken = verifyAccessToken(token);
      if (!decodedToken.success) {
        console.log('token expired, redirecting to refresh route');
        return res.redirect('/refresh');
      }
      console.log('from authenticationMiddleware decodedToken : ', decodedToken);
      next();
    } else if (refreshToken) {
      const refreshVerification = verifyRefreshToken(refreshToken);

      if (refreshVerification.success) {
        const freshAccessToken = generateRefreshToken(refreshVerification.data);
        const newAccessToken = generateAcessToken(refreshVerification.data);

        req.userId = refreshVerification.data.id;
        console.log('from refreshVerification.data.id req.userId', req.userId);

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
      console.log('token expired in authenticationMiddleware: ', JSON.stringify(error.message));
      console.log('redirecting to refreshToken in authenticationMiddleware: ');
      return res.redirect('/refresh');
    }
    console.error('Error in authenticationMiddleware: ', JSON.stringify(error.message));
    // next(error);
    // Return to login page
    return res.redirect('/login');
  }
}
