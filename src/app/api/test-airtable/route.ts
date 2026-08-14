import { listLeads } from '@/lib/airtable';

export async function GET() {
  try {
    const leads = await listLeads();
    return Response.json({
      success: true,
      count: leads.length,
      message: "Airtable is working! Leads table found.",
      leads: leads.slice(0, 3), // Return first 3 leads
    });
  } catch (err: any) {
    return Response.json({
      success: false,
      error: err?.message || "Failed to connect to Airtable",
      details: err?.error || "Unknown error",
      message: "⚠️ Airtable 'Leads' table does not exist. Please create it manually with these fields: Prénom, Email, Mobile, Date, Réponse 1-6, Diagnostic, Statut",
    }, { status: 500 });
  }
}
