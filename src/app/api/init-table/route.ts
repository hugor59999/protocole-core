import { NextRequest, NextResponse } from "next/server";

const SQL = `
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  whatsapp text NOT NULL,
  quiz_answers jsonb,
  open_answer text,
  diagnosis text,
  received_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_whatsapp_idx ON public.leads(whatsapp);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);
`;

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  try {
    // Make direct request to Supabase SQL endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sql: SQL })
    });

    if (!response.ok) {
      // If SQL endpoint doesn't work, try simpler approach
      console.log("Direct SQL failed, table might already exist or need manual creation");
      return NextResponse.json({
        success: true,
        message: "Setup attempted. Please verify table exists in Supabase dashboard.",
        manual_sql: SQL
      });
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      message: "Leads table created or already exists",
      data
    });
  } catch (error: any) {
    console.error("Setup error:", error.message);
    return NextResponse.json({
      success: false,
      message: "Could not auto-create table",
      manual_sql: SQL,
      instructions: "Please run the SQL above manually in Supabase dashboard > SQL Editor"
    });
  }
}
