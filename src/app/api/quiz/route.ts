'use client';

import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { firstName, whatsapp, answers, profile } = await request.json();

    // Validation
    if (!firstName || !whatsapp || !answers || answers.length !== 7 || !profile) {
      return Response.json(
        { error: 'Invalid data' },
        { status: 400 }
      );
    }

    // Store in memory (persists for the deployment duration)
    const quizData = {
      first_name: firstName,
      whatsapp,
      profile,
      answers,
      created_at: new Date().toISOString(),
    };

    // Log to console (will show in Vercel logs)
    console.log('Quiz submission:', quizData);

    return Response.json({
      success: true,
      profile,
      message: 'Quiz submitted successfully'
    });
  } catch (err) {
    console.error('Quiz error:', err);
    return Response.json(
      { error: (err as any).message || 'Server error' },
      { status: 500 }
    );
  }
}
