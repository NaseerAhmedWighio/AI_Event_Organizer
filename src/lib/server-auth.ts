import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken, User } from '@/lib/auth';
import { findUserById } from '@/lib/user-db';

/**
 * Get the current authenticated user from server components
 * Redirects to sign-in if not authenticated
 */
export async function getAuthUser(): Promise<User> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/sign-in');
  }

  const payload = verifyToken(token);
  if (!payload) {
    redirect('/sign-in');
  }

  const user = await findUserById(payload.userId);
  if (!user) {
    redirect('/sign-in');
  }

  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Check if user is authenticated (doesn't redirect)
 */
export async function checkAuth(): Promise<{ isAuthenticated: boolean; userId?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return { isAuthenticated: false };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return { isAuthenticated: false };
  }

  return { isAuthenticated: true, userId: payload.userId };
}
