import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateToken, hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, name, googleId, picture } = await request.json();

    if (!email || !googleId) {
      return NextResponse.json(
        { error: 'Email and Google ID are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name: name || 'Google User',
          password: await hashPassword(googleId), // Use Google ID as password hash
          emailVerified: true,
        },
      });
    }

    const token = generateToken(user.id);

    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
