import jwt from 'jsonwebtoken';

// Generate a new refresh token
export function generateRefreshToken(user) {
  const payload = {
    id: user._id,
    username: user.username,
  };

  const options = { expiresIn: '7d' };

  const freshToken = jwt.sign(payload, process.env.FRESH_TOKEN_SECRET, options);
  console.log('freshToken from generateRefreshToken', freshToken);
  return freshToken;
}

// Verify a refresh token
export function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.FRESH_TOKEN_SECRET);
    console.log('decoded from verifyRefreshToken', decoded);
    return { success: true, data: decoded };
  } catch (error) {
    console.error('error in verfiRefreshToken', error.message);
    return { success: false, error: error.message };
  }
}
