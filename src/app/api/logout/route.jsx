import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('token', '', { path: '/', expires: new Date(0) }); // Clear the token
  return response;
}
