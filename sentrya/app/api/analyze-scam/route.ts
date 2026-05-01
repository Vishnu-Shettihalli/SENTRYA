import { NextRequest, NextResponse } from 'next/server';
import { anthropic, SYSTEM_PROMPT } from '@/lib/anthropic';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analyze this message for scam/fraud indicators targeting rural Indian banking users.

Message: "${message}"

Respond with ONLY this JSON structure (no other text):
{
  "risk": "High|Medium|Low",
  "keywords": ["keyword1", "keyword2"],
  "explanation": "2-3 sentence plain English explanation of why this is or is not a scam, what patterns were detected",
  "verdict": "SCAM DETECTED|SUSPICIOUS|SAFE",
  "action": "One clear action the user should take right now"
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
    console.error('Scam analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 });
  }
}
