import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), '.data');
const RESULTS_FILE = path.join(DB_PATH, 'quiz_results.json');

async function getQuizResults() {
  try {
    const content = await fs.readFile(RESULTS_FILE, 'utf-8');
    const results = JSON.parse(content);
    return results.sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (err) {
    console.log('No results file yet:', err);
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const results = await getQuizResults();

    const formattedResults = results.map((row: any) => ({
      id: row.id,
      first_name: row.first_name,
      whatsapp: row.whatsapp,
      profile: row.profile,
      answers: typeof row.answers === 'string' ? row.answers : JSON.stringify(row.answers),
      created_at: row.created_at,
    }));

    console.log('Results fetched:', formattedResults.length);
    return Response.json({
      success: true,
      results: formattedResults
    });
  } catch (err: any) {
    console.error('Fetch error:', err.message);
    return Response.json({
      success: true,
      results: []
    }, { status: 200 });
  }
}
