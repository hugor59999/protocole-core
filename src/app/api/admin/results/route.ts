export async function GET(request: Request) {
  try {
    // Quiz submissions are logged to console/Vercel logs
    // Data storage requires configuration on Vercel (Postgres, KV, or similar)
    console.log('Dashboard: Fetching quiz results (not persisted without database)');

    return Response.json({
      success: true,
      results: [],
      message: 'Configure database for persistence'
    });
  } catch (err: any) {
    console.error('Error:', err.message);
    return Response.json({
      success: true,
      results: []
    }, { status: 200 });
  }
}
