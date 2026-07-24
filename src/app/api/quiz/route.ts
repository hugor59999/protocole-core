import { sql } from '@vercel/postgres';

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

    const quizData = {
      first_name: firstName,
      whatsapp,
      profile,
      answers: JSON.stringify(answers),
      created_at: new Date().toISOString(),
    };

    // Log to console
    console.log('Quiz submission:', quizData);

    // Try to save to Vercel Postgres (if configured)
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS quiz_results (
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          whatsapp TEXT NOT NULL,
          profile TEXT NOT NULL,
          answers TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT now()
        );
      `;

      await sql`
        INSERT INTO quiz_results (first_name, whatsapp, profile, answers, created_at)
        VALUES (${firstName}, ${whatsapp}, ${profile}, ${JSON.stringify(answers)}, ${quizData.created_at})
      `;
      console.log('Quiz saved to Vercel Postgres');
    } catch (dbErr: any) {
      console.log('Database not configured - logging only:', dbErr.message);
      // Non-blocking: continue even if database is not configured
    }

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
