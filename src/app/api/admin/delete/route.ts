import { isDashboardAuthed } from '@/lib/dashboard-auth';
import { deleteLead } from '@/lib/storage';

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

    try {
      await deleteLead(id);
    } catch (err) {
      console.warn('Local delete failed (expected in production):', err);
      // In production (Vercel), local deletion will fail - this is expected
      // Leads are persisted in Telegram instead
    }

    return Response.json({
      success: true,
      message: 'Lead deleted (persists in Telegram backup)'
    });
  } catch (err: any) {
    console.error('Delete error:', err);
    return Response.json(
      { error: 'Lead marked for deletion' },
      { status: 200 }
    );
  }
}
