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

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      occupation: user.occupation,
      income: user.income,
      householdSize: user.householdSize,
      livingWith: user.livingWith,
      location: user.location,
      riskTolerance: user.riskTolerance,
      savingsRate: user.savingsRate,
      monthlyBudget: user.monthlyBudget,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      name,
      occupation,
      income,
      householdSize,
      livingWith,
      location,
      riskTolerance,
      savingsRate,
      monthlyBudget,
    } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || user.name,
        occupation,
        income,
        householdSize,
        livingWith,
        location,
        riskTolerance,
        savingsRate,
        monthlyBudget,
      },
    });

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      occupation: updatedUser.occupation,
      income: updatedUser.income,
      householdSize: updatedUser.householdSize,
      livingWith: updatedUser.livingWith,
      location: updatedUser.location,
      riskTolerance: updatedUser.riskTolerance,
      savingsRate: updatedUser.savingsRate,
      monthlyBudget: updatedUser.monthlyBudget,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
