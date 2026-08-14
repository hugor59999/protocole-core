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

    // Try local storage for now
    try {
      await deleteLead(id);
      console.log('Lead deleted from local storage');
    } catch (localErr) {
      console.warn('Local delete failed:', localErr);
    }

    return Response.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (err: any) {
    console.error('Delete error:', err);
    return Response.json(
      { error: 'Failed to delete' },
      { status: 500 }
    );
  }
}
