import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode('your-secret-key');

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload; // Return the decoded payload (user info)
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}
