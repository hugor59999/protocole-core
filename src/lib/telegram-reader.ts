// Read leads from Telegram messages (for production dashboard)
// Note: This reads the last N messages from the chat as a fallback storage

export async function getLeadsFromTelegram() {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return [];
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getHistory`;
    // Note: This endpoint doesn't exist in Telegram Bot API
    // Instead, we'll provide a fallback message

    // For now, return empty array - Telegram API doesn't support reading message history
    // This is a limitation of the Telegram Bot API
    console.log('Note: Telegram lead history not available via Bot API');
    return [];
  } catch (err) {
    console.error('Error reading Telegram leads:', err);
    return [];
  }
}
