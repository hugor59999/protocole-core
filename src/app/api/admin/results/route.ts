import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function GET(request: Request) {
  try {
    // Check password
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    if (!password || password !== adminPassword) {
      return Response.json(
        { error: 'Unauthorized', debug: { provided: !!password, expected: !!adminPassword } },
        { status: 401 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return Response.json({
      success: true,
      results: data,
    });
  } catch (err) {
    console.error('Fetch error:', err);
    return Response.json(
      { error: (err as any).message || 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
