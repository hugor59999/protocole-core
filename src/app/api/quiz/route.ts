export async function POST(request: Request) {
  try {
    const { firstName, whatsapp, answers, profile } = await request.json();

    // Validation
    if (!firstName || !whatsapp || !answers || answers.length !== 7 || !profile) {
      return Response.json(
        { error: 'Invalid data' },
        { status: 400 }
      );
    }

    const quizData = {
      id: Date.now(),
      first_name: firstName,
      whatsapp,
      profile,
      answers: JSON.stringify(answers),
      created_at: new Date().toISOString(),
    };

    // Log to console
    console.log('Quiz submission:', quizData);

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
