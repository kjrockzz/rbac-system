import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key';

export async function GET(req) {
  const token = req.cookies.get('token');

  if (!token) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return new Response(JSON.stringify({ message: 'Protected content', user: decoded }), {
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ message: 'Invalid or expired token' }), {
      status: 403,
    });
  }
}
