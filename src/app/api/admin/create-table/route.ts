import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: Request) {
  if (!supabaseUrl || !supabaseKey) {
    return Response.json({
      error: 'Missing Supabase credentials',
    }, { status: 500 });
  }

  // Basic security: require a secret key
  const body = await req.json();
  if (body.secret !== process.env.DASHBOARD_PASSWORD) {
    return Response.json({
      error: 'Unauthorized',
    }, { status: 401 });
  }

  try {
    const client = createClient(supabaseUrl, supabaseKey);

    // Execute SQL to create table
    const sql = `
      CREATE TABLE IF NOT EXISTS leads (
        id BIGSERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        email TEXT NOT NULL,
        mobile TEXT,
        answers JSONB,
        diagnosis TEXT,
        status TEXT DEFAULT 'À contacter',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
      CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
    `;

    const { data, error } = await client.rpc('exec', {
      sql,
    }).catch(() => {
      // RPC might not exist, try direct approach
      return { data: null, error: { message: 'RPC not available' } };
    });

    if (error && error.message !== 'RPC not available') {
      return Response.json({
        status: 'error',
        message: 'Failed to create table',
        error: error.message,
      }, { status: 500 });
    }

    // For now, return instructions
    return Response.json({
      status: 'success',
      message: 'Table creation instructions',
      instructions: `
        The leads table needs to be created manually in Supabase.
        Go to SQL Editor in Supabase and run:
        ${sql}
      `,
      sql,
    });
  } catch (err: any) {
    return Response.json({
      error: err.message,
      status: 'error',
    }, { status: 500 });
  }
}
