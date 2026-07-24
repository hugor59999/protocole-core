import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), '.data');
const RESULTS_FILE = path.join(DB_PATH, 'quiz_results.json');

async function ensureDbDir() {
  try {
    await fs.mkdir(DB_PATH, { recursive: true });
  } catch (err) {
    console.error('Error creating db directory:', err);
  }
}

async function saveQuizResult(data: any) {
  try {
    await ensureDbDir();

    let results: any[] = [];
    try {
      const content = await fs.readFile(RESULTS_FILE, 'utf-8');
      results = JSON.parse(content);
    } catch (err) {
      results = [];
    }

    results.push({
      ...data,
      id: Date.now(),
    });

    await fs.writeFile(RESULTS_FILE, JSON.stringify(results, null, 2));
    console.log('Quiz saved to file database');
  } catch (err) {
    console.error('Error saving to database:', err);
  }
}

export async function POST(request: Request) {
  try {
    const { firstName, whatsapp, answers, profile } = await request.json();

    if (!firstName || !whatsapp || !answers || answers.length !== 7 || !profile) {
      return Response.json(
        { error: 'Invalid data' },
        { status: 400 }
      );
    }

    const quizData = {
      first_name: firstName,
      whatsapp,
      profile,
      answers: JSON.stringify(answers),
      created_at: new Date().toISOString(),
    };

    console.log('Quiz submission:', quizData);
    await saveQuizResult(quizData);

    return Response.json({
      success: true,
      profile,
      message: 'Quiz submitted successfully'
    });
  } catch (err) {
    console.error('Quiz error:', err);
    return Response.json(
      { error: (err as any).message || 'Server error' },
      { status: 500 }
    );
  }
}
