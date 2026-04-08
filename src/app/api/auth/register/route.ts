import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken, generateUserId, setAuthCookieHeaders, TokenPayload } from '@/lib/auth';
import { findUserByEmail, createUser, StoredUser } from '@/lib/user-db';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userId = generateUserId();
    const newUser: StoredUser = {
      id: userId,
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await createUser(newUser);

    // Generate token
    const tokenPayload: TokenPayload = {
      userId: newUser.id,
      email: newUser.email,
    };
    const token = generateToken(tokenPayload);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;

    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });

    // Set auth cookie
    const headers = setAuthCookieHeaders(token);
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
