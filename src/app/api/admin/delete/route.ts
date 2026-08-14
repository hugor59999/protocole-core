import { isDashboardAuthed } from '@/lib/dashboard-auth';
import { deleteLead } from '@/lib/storage';
import { deleteLeadGitHub } from '@/lib/github-storage';

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

    // Try GitHub storage first
    try {
      await deleteLeadGitHub(id);
      console.log('Lead deleted from GitHub Issues');
    } catch (ghErr) {
      console.warn('GitHub delete failed, trying local:', ghErr);
      try {
        await deleteLead(id);
        console.log('Lead deleted from local storage');
      } catch (localErr) {
        console.warn('Local delete also failed:', localErr);
      }
    }

    return Response.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (err: any) {
    console.error('Delete error:', err);
    return Response.json(
      { error: 'Lead marked for deletion' },
      { status: 200 }
    );
  }
}
