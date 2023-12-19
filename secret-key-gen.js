const crypto = require('crypto');

// Generate a random string of specified length
const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

// Specify the length of the secret (e.g., 32 bytes for a 256-bit secret)
const secretLength = 200;

// Generate the JWT secret
const secretKey = generateRandomString(secretLength);

console.log('Secret Key:', secretKey);
