import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create table using raw SQL via Supabase
    const { error } = await supabase.rpc('exec_sql', {
      query: `
        create table if not exists quiz_results (
          id bigint primary key generated always as identity,
          first_name text not null,
          email text not null,
          whatsapp text not null,
          profile text not null,
          answers jsonb,
          created_at timestamp with time zone default now()
        );

        create index if not exists idx_created_at on quiz_results(created_at);
      `,
    });

    if (error) throw error;

    return Response.json({ success: true, message: 'Database initialized' });
  } catch (err) {
    console.error('Init error:', err);
    return Response.json(
      { error: (err as any).message || 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
