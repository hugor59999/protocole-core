import { isDashboardAuthed } from '@/lib/dashboard-auth';
import Airtable from 'airtable';

function getTable() {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID as string
  );
  return base('Leads');
}

export async function DELETE(request: Request) {
  const isAuthed = await isDashboardAuthed();
  if (!isAuthed) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return Response.json(
        { error: 'Missing id' },
        { status: 400 }
      );
    }

    const table = getTable();
    await table.destroy(id);

    return Response.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (err: any) {
    console.error('Delete error:', err);
    return Response.json(
      { error: err.message || 'Failed to delete' },
      { status: 500 }
    );
  }
}
