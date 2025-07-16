import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message, currency } = await request.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert expense calculator and financial assistant for group expenses, trips, and shared costs.

Currency for all calculations: ${currency ? currency : 'Not specified'}

Analyze this expense message and provide a clear, conversational response: "${message}"

Your response should:
1. Acknowledge what expenses were mentioned
2. Calculate totals, splits, and settlements clearly
3. Show step-by-step math when helpful
4. Use a friendly, conversational tone
5. Include emojis for better readability
6. Handle any currency (dollars, rupees, etc.)
${currency ? '7. Use the provided currency for all calculations. Do NOT ask the user for currency.' : '7. If the user does NOT specify a currency, politely ask them what currency they are using before proceeding with calculations.'}

For calculations:
- Calculate equal splits unless specified otherwise
- Show who owes whom and how much
- Break down complex scenarios step by step
- Handle multiple payers correctly
- Round amounts to 2 decimal places

Format example:
"💰 <strong>Expense Summary:</strong>
Total trip cost: ₹13,600
- You paid: ₹11,400
- Vihanga paid: ₹2,200 (chicken)

👥 <strong>Split Calculation:</strong>
With 5 people total, each person's share: ₹13,600 ÷ 5 = ₹2,720

💸 <strong>Who Owes What:</strong>
- You should collect ₹8,680 total from others
- Vihanga owes you: ₹520 (₹2,720 - ₹2,200 already paid)
- The other 3 people each owe you: ₹2,720

✅ <strong>Summary:</strong> You're owed ₹8,680 total"

If the message isn't about expenses, politely redirect: "I'm designed to help with expense calculations and splits. Could you share details about an expense you'd like me to analyze?"

Message: "${message}"
Response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({ 
      message: text,
      success: true 
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ 
      message: "Sorry, I'm having trouble processing that right now. Please try again!",
      success: false 
    }, { status: 500 });
  }
} 