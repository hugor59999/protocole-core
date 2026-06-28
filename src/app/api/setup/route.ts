import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return Response.json({ error: 'Missing env vars' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Test insert to see if RLS is blocking
    const { error } = await supabase
      .from('quiz_results')
      .insert([{
        first_name: 'Setup Test',
        email: 'setup@test.com',
        whatsapp: '+33600000000',
        profile: 'test',
        answers: []
      }])
      .select();

    if (error?.message.includes('row-level security policy')) {
      // RLS is blocking, need to disable it
      return Response.json({
        status: 'RLS_BLOCKING',
        message: 'Table has RLS enabled. Need manual fix in Supabase dashboard.',
        error: error.message
      });
    }

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, message: 'Setup complete' });
  } catch (err) {
    return Response.json(
      { error: (err as any).message },
      { status: 500 }
    );
  }
}
