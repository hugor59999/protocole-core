import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { firstName, whatsapp, answers, profile } = await request.json();

    if (!firstName || !whatsapp || !answers || answers.length !== 7 || !profile) {
      return Response.json(
        { error: 'Invalid data' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from('quiz_results')
      .insert([
        {
          first_name: firstName,
          whatsapp,
          profile,
          answers: JSON.stringify(answers),
          created_at: new Date().toISOString(),
        },
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
      return Response.json(
        { error: 'Failed to save to database: ' + dbError.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error('Quiz error:', err);
    return Response.json(
      { error: (err as any).message || 'Server error' },
      { status: 500 }
    );
  }
}
