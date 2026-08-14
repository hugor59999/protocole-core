import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface Lead {
  firstName: string;
  email: string;
  mobile: string;
  date: string;
  answers: string[];
  diagnosis: string;
  status?: string;
}

let supabase: any = null;

function getSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }

  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }

  return supabase;
}

export async function addLeadSupabase(lead: Lead): Promise<string> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('leads')
    .insert([{
      first_name: lead.firstName,
      email: lead.email,
      mobile: lead.mobile,
      answers: lead.answers,
      diagnosis: lead.diagnosis,
      status: lead.status || 'À contacter',
      created_at: lead.date,
    }])
    .select();

  if (error) {
    console.error('Supabase insert error:', error);
    throw error;
  }

  return data[0]?.id || 'unknown';
}

export async function getLeadsSupabase(): Promise<Lead[]> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase fetch error:', error);
    throw error;
  }

  return (data || []).map((row: any) => ({
    firstName: row.first_name,
    email: row.email,
    mobile: row.mobile,
    date: row.created_at,
    answers: row.answers,
    diagnosis: row.diagnosis,
    status: row.status,
  }));
}
