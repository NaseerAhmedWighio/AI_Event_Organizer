import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/api'];

// Routes that should redirect to sign-in if authenticated
const authRoutes = ['/sign-in', '/sign-up'];

function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some(route => path.startsWith(route));
}

function isAuthRoute(path: string): boolean {
  return authRoutes.some(route => path.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // Verify token if it exists
  let isAuthenticated = false;
  if (token) {
    const payload = verifyToken(token);
    isAuthenticated = !!payload;
  }

  // Redirect to sign-in if accessing protected route without auth
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect to dashboard if accessing auth routes while already authenticated
  if (isAuthRoute(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!.*\\.[\\w]+$|_next/static|_next/image|favicon.ico).*)',
  ],
};
