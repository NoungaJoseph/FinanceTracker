import { PrismaClient } from '@prisma/client';
import { generateToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, name, appleId } = await request.json();

    if (!email || !appleId) {
      return NextResponse.json(
        { error: 'Email and Apple ID are required' },
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
          name: name || 'Apple User',
          appleId,
          emailVerified: true,
          password: '', // No password for OAuth users
        },
      });
    } else if (!user.appleId) {
      // Update existing user with Apple ID
      user = await prisma.user.update({
        where: { id: user.id },
        data: { appleId },
      });
    }

    const token = generateToken(user.id);

    return NextResponse.json(
      {
        message: 'Apple login successful',
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
    console.error('Apple auth error:', error);
    return NextResponse.json(
      { error: 'Apple authentication failed' },
      { status: 500 }
    );
  }
}
