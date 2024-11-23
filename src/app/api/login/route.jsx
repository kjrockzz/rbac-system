import { SignJWT } from 'jose';
import fs from 'fs';
import path from 'path';

const SECRET_KEY = new TextEncoder().encode('your-secret-key');
const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

export async function POST(req) {
  const { email, password } = await req.json();

  // Read users from the JSON file
  const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

  // Find the user by email and password
  const user = usersData.find(
    u => u.email === email && u.password === password
  );

  // Check if the user exists and is active
  if (user && user.isActive) {
    // Generate JWT
    const token = await new SignJWT({ email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(SECRET_KEY);

    // Return token in Set-Cookie header
    return new Response(JSON.stringify({ message: 'Login successful' }), {
      status: 200,
      headers: { 'Set-Cookie': `token=${token}; Path=/; HttpOnly` },
    });
  }

  return new Response(
    JSON.stringify({
      message: user && !user.isActive
        ? 'Your account is inactive. Please contact admin.'
        : 'Invalid credentials',
    }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
