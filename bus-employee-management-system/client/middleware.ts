/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
  '/authentication/login',
  '/authentication/reset-password',
  '/authentication/new-password',
  '/authentication/security-questions',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // console.log('Middleware triggered for:', pathname);

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // console.log('MIDDLEWARE: public route allowed');
    return NextResponse.next();
  }

  // Check for JWT cookie
  const jwt = request.cookies.get('jwt')?.value;
  // console.log('MIDDLEWARE: jwt', jwt);

  if (!jwt) {
    // console.log('MIDDLEWARE: no jwt, redirecting to login');
    const loginUrl = new URL('/authentication/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // (Optional) Verify JWT with backend
  try {
    // console.log(process.env.NEXT_PUBLIC_API_URL);
    const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (!verifyRes.ok) {
      // console.log('MIDDLEWARE: JWT invalid or expired');
      const loginUrl = new URL('/authentication/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  } catch (e) {
    // console.log('MIDDLEWARE: Error verifying JWT', e);
    const loginUrl = new URL('/authentication/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets|api|authentication/login|authentication/reset-password|authentication/new-password|authentication/security-questions).*)'
  ]
};
// This matcher excludes Next.js static files, API routes, and public authentication routes