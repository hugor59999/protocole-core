export async function POST(req: Request) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return Response.json({
      error: "Missing credentials",
      hasToken: !!TELEGRAM_BOT_TOKEN,
      hasChatId: !!TELEGRAM_CHAT_ID,
    }, { status: 400 });
  }

  const { firstName, email, mobile } = await req.json();

  const message = `🎯 **LEAD TEST**

👤 **Prénom:** ${firstName}
📧 **Email:** ${email}
📱 **Mobile:** ${mobile}

⏰ Envoyé à: ${new Date().toISOString()}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const data = await response.json();

    return Response.json({
      status: response.status,
      success: data.ok,
      messageId: data.result?.message_id,
      error: data.description,
      chatId: TELEGRAM_CHAT_ID,
    });
  } catch (err: any) {
    return Response.json({
      error: err.message,
      chatId: TELEGRAM_CHAT_ID,
    }, { status: 500 });
  }
}
