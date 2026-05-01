import { NextRequest, NextResponse } from 'next/server';
import { anthropic, SYSTEM_PROMPT } from '@/lib/anthropic';

export async function POST(req: NextRequest) {
  try {
    const { amount, receiver, know, urgent, channel } = await req.json();

    if (!amount || !receiver) {
      return NextResponse.json({ error: 'Amount and receiver are required' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `A rural banking user wants to make a transaction. Evaluate the fraud risk.

Transaction Details:
- Amount: ₹${amount}
- Receiver: ${receiver}
- Knows receiver personally: ${know || 'not specified'}
- Marked as urgent: ${urgent || 'not specified'}
- Request came via: ${channel || 'not specified'}

Respond with ONLY this JSON structure (no other text):
{
  "decision": "ALLOW|WARN|BLOCK",
  "riskLevel": "Low|Medium|High",
  "explanation": "2-3 plain English sentences explaining the decision in a way a rural user would understand",
  "redFlags": ["red flag 1", "red flag 2"],
  "advice": "One clear action the user should take"
}`,
        },
      ],
    });

    const text = response.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('');

    const cleaned = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Transaction analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 });
  }
}
