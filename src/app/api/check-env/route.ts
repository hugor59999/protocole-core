export async function GET() {
  return Response.json({
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? "✅ SET" : "❌ MISSING",
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID ? `✅ SET: ${process.env.TELEGRAM_CHAT_ID}` : "❌ MISSING",
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY ? "✅ SET" : "❌ MISSING",
    RESEND_API_KEY: process.env.RESEND_API_KEY ? "✅ SET" : "❌ MISSING",
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
