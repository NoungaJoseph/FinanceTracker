import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const goals = await prisma.financialGoal.findMany({
      where: { userId: user.id },
      orderBy: { targetDate: 'asc' },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, targetAmount, currentAmount, targetDate, category, description } = await request.json();

    if (!name || !targetAmount || !targetDate || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const goal = await prisma.financialGoal.create({
      data: {
        userId: user.id,
        name,
        targetAmount,
        currentAmount: currentAmount || 0,
        targetDate: new Date(targetDate),
        category,
        description,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error('Create goal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
