import { isDashboardAuthed } from '@/lib/dashboard-auth';
import { getAllLeads as getAllLeadsLocal } from '@/lib/storage';
import { getLeadsSupabase } from '@/lib/supabase-storage';

export async function GET() {
  const isAuthed = await isDashboardAuthed();
  if (!isAuthed) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    let leads: any[] = [];

    // Try Supabase first (production)
    try {
      leads = await getLeadsSupabase();
      console.log("Leads fetched from Supabase:", leads.length);
    } catch (supabaseErr) {
      console.error("Supabase fetch failed, trying local storage:", supabaseErr);
      // Fallback to local storage in development
      try {
        leads = await getAllLeadsLocal();
        console.log("Leads fetched from local storage:", leads.length);
      } catch (localErr) {
        console.error("Local storage fetch failed:", localErr);
        throw localErr;
      }
    }

    return Response.json({
      success: true,
      leads: leads.map((l) => ({
        id: l.id,
        firstName: l.firstName,
        email: l.email,
        mobile: l.mobile,
        date: l.date,
        answers: l.answers,
        diagnosis: l.diagnosis,
        status: l.status,
      })),
    });
  } catch (err: any) {
    console.error('Fetch leads error:', err.message);
    return Response.json(
      { success: false, error: err.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
