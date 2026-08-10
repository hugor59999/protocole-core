import { isDashboardAuthed } from '@/lib/dashboard-auth';

export async function GET() {
  const isAuthed = await isDashboardAuthed();

  if (isAuthed) {
    return Response.json({ authenticated: true });
  }

  return Response.json({ authenticated: false }, { status: 401 });
}
