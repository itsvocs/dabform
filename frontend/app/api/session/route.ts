import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    await createSession(token);
    return NextResponse.json({ success: true });
  } catch (error) {
      console.log(error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
    
  }
}