export async function GET() {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return Response.json({
      error: 'Missing credentials',
      hasToken: !!TELEGRAM_BOT_TOKEN,
      hasChatId: !!TELEGRAM_CHAT_ID,
    });
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: '🧪 Test message from Protocole Core\n\nIf you see this, Telegram is working!',
        }),
      }
    );

    const data = await response.json();

    return Response.json({
      status: response.status,
      success: data.ok,
      message: data.result?.text || 'Message sent',
      error: data.description || null,
      chatId: TELEGRAM_CHAT_ID,
    });
  } catch (err: any) {
    return Response.json({
      error: err.message,
      chatId: TELEGRAM_CHAT_ID,
    });
  }
}
