import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
  try {
    // Try to fetch from Vercel Postgres
    try {
      const result = await sql`
        SELECT id, first_name, whatsapp, profile, answers, created_at
        FROM quiz_results
        ORDER BY created_at DESC
        LIMIT 1000
      `;

      const results = result.rows.map((row: any) => ({
        id: row.id,
        first_name: row.first_name,
        whatsapp: row.whatsapp,
        profile: row.profile,
        answers: typeof row.answers === 'string' ? row.answers : JSON.stringify(row.answers),
        created_at: row.created_at?.toISOString?.() || row.created_at,
      }));

      console.log('Results fetched from Vercel Postgres:', results.length);
      return Response.json({
        success: true,
        results
      });
    } catch (dbErr: any) {
      console.log('Database not configured - returning empty results:', dbErr.message);
      return Response.json({
        success: true,
        results: [],
        message: 'Configure Vercel Postgres to view results'
      });
    }
  } catch (err: any) {
    console.error('Fetch error:', err.message);
    return Response.json({
      success: true,
      results: []
    }, { status: 200 });
  }
}
