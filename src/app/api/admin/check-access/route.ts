import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { findUserById } from '@/lib/user-db';

const MAIN_ADMIN_EMAIL = 'naseerahmedwighio@gmail.com';

/**
 * GET /api/admin/check-access
 * Checks if the current user has admin access (MAIN ADMIN ONLY)
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { isAdmin: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { isAdmin: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Find user
    const user = await findUserById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { isAdmin: false, error: 'User not found' },
        { status: 401 }
      );
    }

    // Check admin access
    const isAdmin = user.role === 'admin' || user.role === 'subadmin';
    const isSubAdmin = user.role === 'subadmin';
    const isMainAdmin = user.email === MAIN_ADMIN_EMAIL;

    return NextResponse.json({
      success: true,
      isAdmin: isAdmin,
      isMainAdmin,
      isSubAdmin,
      role: user.role || 'user',
    });
  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json(
      { isAdmin: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
