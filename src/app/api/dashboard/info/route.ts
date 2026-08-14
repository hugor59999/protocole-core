import { isDashboardAuthed } from '@/lib/dashboard-auth';

export async function GET() {
  const isAuthed = await isDashboardAuthed();

  return Response.json({
    environment: process.env.NODE_ENV || 'development',
    status: 'operational',
    message: isAuthed ? 'Authenticated' : 'Not authenticated',
    info: {
      production: {
        storage: 'Telegram (persistent)',
        leads: 'Automatically backed up to Telegram channel',
        access: 'Check your Telegram for all submitted leads'
      },
      development: {
        storage: '.data/leads.json (local file)',
        leads: 'Stored locally for testing',
        dashboard: 'Fully functional'
      }
    }
  });
}
