export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return Response.json({
      error: "CREDENTIALS MISSING",
      hasToken: !!token,
      hasChatId: !!chatId,
    }, { status: 400 });
  }

  const msg = `TEST - ${new Date().toISOString()}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: msg }),
    });

    const data = await res.json();

    return Response.json({
      sentOk: data.ok,
      messageId: data.result?.message_id,
      error: data.description,
      statusCode: res.status,
    });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
