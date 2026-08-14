import { getAllLeads } from '@/lib/storage';

export async function GET() {
  try {
    const leads = await getAllLeads();
    return Response.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (err: any) {
    console.error('Fetch leads error:', err.message);
    return Response.json(
      { success: false, error: err.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
