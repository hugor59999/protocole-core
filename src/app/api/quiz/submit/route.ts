import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, email, whatsapp, profile, answers } = body;

    if (!firstName || !email || !whatsapp || !profile) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('quiz_results')
      .insert([
        {
          first_name: firstName,
          email,
          whatsapp,
          profile,
          answers: answers || [],
        },
      ])
      .select();

    if (error) throw error;

    return Response.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error('Submit error:', err);
    return Response.json(
      { error: (err as any).message || 'Failed to save results' },
      { status: 500 }
    );
  }
}
