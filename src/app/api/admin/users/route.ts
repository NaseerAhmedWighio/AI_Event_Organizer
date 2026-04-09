import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/user-db';
import { checkAuth } from '@/lib/server-auth';

/**
 * GET /api/admin/users
 * Returns all users with their details (including password hashes)
 * WARNING: This is for admin/debugging purposes only!
 */
export async function GET(request: NextRequest) {
  try {
    // Check if request is from authorized user
    const authCheck = await checkAuth();
    
    if (!authCheck.isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const users = await getAllUsers();

    // Return users with password hashes
    return NextResponse.json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        _id: user._id,
        id: user.id,
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password, // Password hash included for admin viewing
        profileImageUrl: user.profileImageUrl,
        role: user.role || 'user',
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt || 'Never',
      })),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
