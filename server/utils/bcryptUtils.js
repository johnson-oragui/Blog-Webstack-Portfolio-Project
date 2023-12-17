import bcrypt from 'bcrypt';

export async function hashedPwd(plainPassword) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error.message);
    throw error;
  }
}

export async function checkHashedPwd(plainPassword, hashedPassword) {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error comparing passwords:', error.message);
    throw error;
  }
}
