import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an expert expense calculator for group trips and shared costs.

Parse this expense message: "${message}"

Calculate:
1. Total expenses by each person
2. Equal split amounts per person
3. Who owes whom and how much

Rules:
- If someone pays for the group, others owe them their share
- Calculate equal splits unless specific amounts mentioned
- Handle multiple payers and complex scenarios
- If a field is missing, infer or estimate it
- Always return valid JSON with all required fields, even if some values are 0 or empty strings

Required JSON format:
{
  "expenses": [{"amount": number, "description": string, "payer": string}],
  "people": ["name1", "name2", ...],
  "totalAmount": number,
  "perPersonShare": number,
  "settlements": [{"from": string, "to": string, "amount": number}]
}

Examples:
1. "Trip cost 1000, I paid 800, John paid 200, split among 4 people"
Output: {
  "expenses": [
    {"amount": 800, "description": "trip expenses", "payer": "me"},
    {"amount": 200, "description": "trip expenses", "payer": "John"}
  ],
  "people": ["me", "John", "person3", "person4"],
  "totalAmount": 1000,
  "perPersonShare": 250,
  "settlements": [
    {"from": "person3", "to": "me", "amount": 250},
    {"from": "person4", "to": "me", "amount": 250},
    {"from": "John", "to": "me", "amount": 50}
  ]
}
2. "expenses for the trip was 11400. i paid them so i can collect later from others. but vihanga also paid 2200 for chicken. altogether five members were there. how much each should pay me back"
Output: {
  "expenses": [
    {"amount": 11400, "description": "trip expenses", "payer": "me"},
    {"amount": 2200, "description": "chicken", "payer": "Vihanga"}
  ],
  "people": ["me", "Vihanga", "person3", "person4", "person5"],
  "totalAmount": 13600,
  "perPersonShare": 2720,
  "settlements": [
    {"from": "person3", "to": "me", "amount": 2720},
    {"from": "person4", "to": "me", "amount": 2720},
    {"from": "person5", "to": "me", "amount": 2720},
    {"from": "Vihanga", "to": "me", "amount": 520}
  ]
}
3. "Sarah spent 25 on coffee, Tom owes her 12.50"
Output: {
  "expenses": [
    {"amount": 25, "description": "coffee", "payer": "Sarah"}
  ],
  "people": ["Sarah", "Tom"],
  "totalAmount": 25,
  "perPersonShare": 12.5,
  "settlements": [
    {"from": "Tom", "to": "Sarah", "amount": 12.5}
  ]
}

Input: "${message}"
JSON:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Gemini raw response:', text); // Debug output

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedData = JSON.parse(jsonMatch[0]);
      // If all fields are empty/zero, return a user-friendly error
      if (
        (!parsedData.expenses || parsedData.expenses.length === 0) &&
        (!parsedData.people || parsedData.people.length === 0) &&
        (!parsedData.settlements || parsedData.settlements.length === 0) &&
        (!parsedData.totalAmount || parsedData.totalAmount === 0)
      ) {
        return NextResponse.json({ error: 'No expenses found. Try rephrasing or simplifying your message.' }, { status: 200 });
      }
      return NextResponse.json(parsedData);
    }

    throw new Error('Invalid response format');

  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Failed to parse expense' },
      { status: 500 }
    );
  }
} 