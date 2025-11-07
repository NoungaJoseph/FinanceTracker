import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateToken, hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, name, githubId, avatar_url } = await request.json();

    if (!email || !githubId) {
      return NextResponse.json(
        { error: 'Email and GitHub ID are required' },
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
          name: name || 'GitHub User',
          password: await hashPassword(githubId), // Use GitHub ID as password hash
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
    console.error('GitHub auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
