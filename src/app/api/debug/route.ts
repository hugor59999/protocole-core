export async function GET() {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  const status = {
    timestamp: new Date().toISOString(),
    env: {
      TELEGRAM_BOT_TOKEN: TELEGRAM_BOT_TOKEN ? `✅ Set (${TELEGRAM_BOT_TOKEN.slice(0, 10)}...)` : "❌ Missing",
      TELEGRAM_CHAT_ID: TELEGRAM_CHAT_ID ? `✅ Set (${TELEGRAM_CHAT_ID})` : "❌ Missing",
      RESEND_API_KEY: RESEND_API_KEY ? `✅ Set (${RESEND_API_KEY.slice(0, 10)}...)` : "❌ Missing",
    },
    testTelegram: null as any,
  };

  // Test Telegram
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: "🔧 Debug test from Protocole Core at " + new Date().toISOString(),
          }),
        }
      );

      const data = await response.json();
      status.testTelegram = {
        status: response.status,
        ok: data.ok,
        messageId: data.result?.message_id,
        error: data.description,
      };
    } catch (err: any) {
      status.testTelegram = { error: err.message };
    }
  }

  return Response.json(status);
}
