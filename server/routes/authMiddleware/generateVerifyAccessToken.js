import jwt from 'jsonwebtoken';

export function generateAcessToken(user) {
  const payload = {
    id: user._id,
    username: user.username,
  };

  const options = { expiresIn: '10s' };

  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
  console.log('token from generateAceesToken: ', token);
  return token;
}

export function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
