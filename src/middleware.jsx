import { NextResponse } from 'next/server';
import { verifyToken } from './utils/verifyToken';

const UNPROTECTED_ROUTES = ['/api/login', '/login'];

export async function middleware(req) {
  const url = req.nextUrl.pathname;

  // Allow access to unprotected routes
  if (UNPROTECTED_ROUTES.some(route => url.startsWith(route))) {
    return NextResponse.next(); // Allow unauthenticated access
  }

  const token = req.cookies.get('token')?.value;

  if (!token) {
    return handleUnauthorized(req); // Redirect or return an error for protected routes
  }

  try {
    const user = await verifyToken(token); // Validate token
    const modifiedReq = req.clone();
    modifiedReq.headers.set('x-user-email', user.email);
    modifiedReq.headers.set('x-user-role', user.role);
    return NextResponse.next({
      request: modifiedReq, // Forward modified request
    });
  } catch (err) {
    return handleUnauthorized(req); // Redirect or return an error for invalid tokens
  }
}

function handleUnauthorized(req) {
  const url = req.nextUrl.clone();
  const isApiRequest = url.pathname.startsWith('/api/');

  if (isApiRequest) {
    // For API requests, return a JSON response
    return new NextResponse(
      JSON.stringify({ message: 'Unauthorized: Invalid or expired token' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } else {
    // For page requests, redirect to the login page
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/:path*'], // Define protected paths
};
