import { isDashboardAuthed } from '@/lib/dashboard-auth';
import { getAllLeads as getAllLeadsLocal } from '@/lib/storage';
import { listLeads as listLeadsAirtable } from '@/lib/airtable';

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

    // Try Airtable first (production)
    try {
      leads = await listLeadsAirtable();
      console.log("Leads fetched from Airtable:", leads.length);
    } catch (airtableErr) {
      console.error("Airtable fetch failed, trying local storage:", airtableErr);
      // Fallback to local storage
      leads = await getAllLeadsLocal();
      console.log("Leads fetched from local storage:", leads.length);
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
