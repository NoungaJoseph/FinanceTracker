import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Using Hugging Face Inference API (free tier available)
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || 'hf_default_key';
    
    // Using a free open-source model: mistral-7b-instruct
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
      {
        headers: { Authorization: `Bearer ${HF_API_KEY}` },
        method: 'POST',
        body: JSON.stringify({
          inputs: `You are a helpful financial advisor AI. Answer the following question concisely and helpfully:\n\n${message}`,
          parameters: {
            max_length: 500,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const fallbackResponse = generateFallbackResponse(message);
      return NextResponse.json({
        response: fallbackResponse,
        source: 'fallback',
      });
    }

    const result = await response.json();
    
    const generatedText = result[0]?.generated_text || '';
    
    const cleanedResponse = generatedText
      .replace(/You are a helpful financial advisor AI.*?\n\n/s, '')
      .trim();

    return NextResponse.json({
      response: cleanedResponse || generateFallbackResponse(message),
      source: 'huggingface',
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    
    const { message } = await request.json();
    return NextResponse.json({
      response: generateFallbackResponse(message),
      source: 'fallback',
    });
  }
}

function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
    return 'A good budgeting strategy is to follow the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Track your expenses regularly to identify areas where you can cut back.';
  }

  if (lowerMessage.includes('save') || lowerMessage.includes('savings')) {
    return 'To build a strong savings habit, start by setting a specific savings goal, automate your savings by setting up automatic transfers, and treat savings as a non-negotiable expense. Aim to save at least 10-20% of your income.';
  }

  if (lowerMessage.includes('invest') || lowerMessage.includes('investment')) {
    return 'Before investing, ensure you have an emergency fund (3-6 months of expenses), pay off high-interest debt, and understand your risk tolerance. Consider diversifying your investments across stocks, bonds, and other assets.';
  }

  if (lowerMessage.includes('debt') || lowerMessage.includes('loan')) {
    return 'To manage debt effectively, list all your debts with interest rates, consider the debt snowball (pay smallest first) or debt avalanche (pay highest interest first) method, and avoid taking on new debt while paying off existing ones.';
  }

  if (lowerMessage.includes('emergency') || lowerMessage.includes('fund')) {
    return 'An emergency fund should cover 3-6 months of living expenses. Start by saving 1 month of expenses, then gradually build it up. Keep it in a separate, easily accessible account.';
  }

  if (lowerMessage.includes('goal') || lowerMessage.includes('financial goal')) {
    return 'Set SMART financial goals: Specific, Measurable, Achievable, Relevant, and Time-bound. Break down large goals into smaller milestones and track your progress regularly.';
  }

  if (lowerMessage.includes('income') || lowerMessage.includes('earn')) {
    return 'To increase your income, consider developing new skills, asking for a raise, starting a side business, or investing in passive income streams. Diversifying income sources provides financial security.';
  }

  if (lowerMessage.includes('tax') || lowerMessage.includes('taxes')) {
    return 'To optimize your taxes, keep detailed records of deductions, contribute to tax-advantaged accounts like 401(k)s or IRAs, and consider consulting with a tax professional for personalized advice.';
  }

  if (lowerMessage.includes('retire') || lowerMessage.includes('retirement')) {
    return 'Start saving for retirement as early as possible to benefit from compound interest. Aim to replace 70-80% of your pre-retirement income. Consider employer 401(k) matches and individual retirement accounts (IRAs).';
  }

  return 'I am here to help with your financial questions! Ask me about budgeting, saving, investing, debt management, emergency funds, financial goals, income strategies, taxes, or retirement planning.';
}
