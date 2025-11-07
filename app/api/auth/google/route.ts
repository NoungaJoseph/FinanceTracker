import { PrismaClient } from '@prisma/client';
import { generateToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, name, googleId } = await request.json();

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

    // If user doesn't exist, create one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name: name || 'Google User',
          googleId,
          emailVerified: true,
          password: '', // No password for OAuth users
        },
      });
    } else if (!user.googleId) {
      // Update existing user with Google ID
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      });
    }

    const token = generateToken(user.id);

    return NextResponse.json(
      {
        message: 'Google login successful',
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
      { error: 'Google authentication failed' },
      { status: 500 }
    );
  }
}
