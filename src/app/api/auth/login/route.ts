import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken, TokenPayload } from '@/lib/auth';
import { findUserByEmail, updateLastLogin, updateUser } from '@/lib/user-db';

const MAIN_ADMIN_EMAIL = 'naseerahmedwighio@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Auto-promote main admin email to admin role if not already set
    if (email === MAIN_ADMIN_EMAIL && user.role !== 'admin') {
      await updateUser(user.id, { role: 'admin' });
      user.role = 'admin'; // Update local reference
    }

    // Update last login
    await updateLastLogin(user.id);

    // Generate token
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };
    const token = generateToken(tokenPayload);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });

    // Set auth cookie using Next.js cookies API
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    console.log('Login successful, cookie set for user:', user.email);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
