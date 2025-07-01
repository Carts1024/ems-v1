// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { NextRequest, NextResponse } from 'next/server';

// const publicRoutes = [
//   '/authentication/login',
//   '/authentication/reset-password',
//   '/authentication/new-password',
//   '/authentication/security-questions',
// ];

// export async function middleware(request: NextRequest) {
//   const jwt = request.cookies.get('jwt')?.value;
//   console.log('🔍 middleware saw cookie jwt =', jwt);

//   if (!jwt) {

//     return NextResponse.redirect(new URL('/authentication/reset-password', request.url));
//   }

//   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//   const verifyRes = await fetch(`${apiUrl}/auth/verify`, {
//     method: 'POST',
//     headers: { Authorization: `Bearer ${jwt}` },
//   });

//   if (!verifyRes.ok) {
//     return NextResponse.redirect(new URL('/authentication/login', request.url));
//   }

//   return NextResponse.next();
// }


// export const config = {
//   matcher: [
//     '/((?!api/|_next/static|_next/image|favicon.ico|assets|api|authentication/login|authentication/reset-password|authentication/new-password|authentication/security-questions).*)'
//   ]
// };
// // This matcher excludes Next.js static files, API routes, and public authentication routes






/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

// All routes are public, so middleware does nothing and just continues.
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/:path*', // Match all routes, but middleware is a no-op
  ]
};
// All routes are public; no authentication enforced.