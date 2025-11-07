import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { message, conversationId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    let conversation;
    if (conversationId) {
      conversation = await prisma.aIConversation.findUnique({
        where: { id: conversationId },
        include: { messages: true },
      });
    } else {
      conversation = await prisma.aIConversation.create({
        data: { userId: user.id },
        include: { messages: true },
      });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 10,
    });

    const goals = await prisma.financialGoal.findMany({
      where: { userId: user.id },
    });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const systemPrompt = `You are a helpful financial advisor AI assistant. You help users manage their finances, create budgets, and achieve their financial goals.

User Profile:
- Name: ${user.name}
- Occupation: ${user.occupation || 'Not specified'}
- Monthly Income: $${user.income || 0}
- Household Size: ${user.householdSize || 'Not specified'}
- Living Situation: ${user.livingWith || 'Not specified'}
- Risk Tolerance: ${user.riskTolerance || 'Not specified'}

Financial Summary:
- Total Income (recent): $${totalIncome}
- Total Expenses (recent): $${totalExpenses}
- Current Balance: $${user.monthlyBudget || 0}
- Active Goals: ${goals.length}

Recent Transactions:
${transactions.map(t => \`- \${t.description}: $\${t.amount} (\${t.type})\`).join('\n')}

Active Goals:
${goals.map(g => \`- \${g.name}: $\${g.currentAmount}/$\${g.targetAmount}\`).join('\n')}

Provide personalized financial advice based on their situation. Ask clarifying questions to better understand their needs. Be supportive and encouraging.`;

    const previousMessages = conversation.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        ...previousMessages,
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const assistantMessage = response.content[0].type === 'text' ? response.content[0].text : '';

    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
      },
    });

    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: assistantMessage,
      },
    });

    return NextResponse.json(
      {
        conversationId: conversation.id,
        message: assistantMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
