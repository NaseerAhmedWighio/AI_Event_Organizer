import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { findUserById } from '@/lib/user-db';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    console.log('[Session] Token exists:', !!token);
    
    if (!token) {
      console.log('[Session] No token found in cookies');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    console.log('[Session] Token verification result:', !!payload);
    
    if (!payload) {
      console.log('[Session] Invalid or expired token');
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Find user
    const user = await findUserById(payload.userId);
    console.log('[Session] User found:', !!user, 'ID:', payload.userId);
    
    if (!user) {
      console.log('[Session] User not found in database for ID:', payload.userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Return user data (without password)
    const { password, ...userWithoutPassword } = user;

    console.log('[Session] Authentication successful for:', user.email);

    return NextResponse.json({
      success: true,
      user: {
        ...userWithoutPassword,
        role: userWithoutPassword.role || 'user',
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
