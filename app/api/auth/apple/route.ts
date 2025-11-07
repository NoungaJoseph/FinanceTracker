import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateToken, hashPassword } from '@/lib/auth';

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

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name: name || 'Apple User',
          password: await hashPassword(appleId), // Use Apple ID as password hash
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
    console.error('Apple auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
