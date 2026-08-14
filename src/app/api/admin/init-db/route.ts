import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST() {
  if (!supabaseUrl || !supabaseKey) {
    return Response.json({
      error: 'Missing Supabase credentials',
    }, { status: 500 });
  }

  try {
    const client = createClient(supabaseUrl, supabaseKey);

    // Try to create the leads table
    const { data, error } = await client
      .from('leads')
      .select('count', { count: 'exact', head: true });

    if (error) {
      return Response.json({
        status: 'error',
        message: 'Leads table does not exist',
        error: error.message,
        hint: 'Run the SQL migration to create the table',
        sql: `
          CREATE TABLE leads (
            id BIGSERIAL PRIMARY KEY,
            first_name TEXT NOT NULL,
            email TEXT NOT NULL,
            mobile TEXT,
            answers JSONB,
            diagnosis TEXT,
            status TEXT DEFAULT 'À contacter',
            created_at TIMESTAMP DEFAULT NOW()
          );

          CREATE INDEX idx_leads_email ON leads(email);
          CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
        `,
      });
    }

    return Response.json({
      status: 'ok',
      message: 'Leads table exists and is accessible',
    });
  } catch (err: any) {
    return Response.json({
      error: err.message,
      status: 'error',
    }, { status: 500 });
  }
}
