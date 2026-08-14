const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const MAX_MESSAGE_LENGTH = 4096;

interface Lead {
  firstName: string;
  email: string;
  mobile: string;
  date: string;
  answers: string[];
  diagnosis: string;
}

async function sendTelegramMessage(text: string): Promise<{ok: boolean; messageId?: string; error?: string}> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return { ok: false, error: 'Missing credentials' };
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[TELEGRAM] API Error:', data);
      return { ok: false, error: data.description };
    }

    return { ok: true, messageId: data.result?.message_id };
  } catch (err: any) {
    console.error('[TELEGRAM] Exception:', err.message);
    return { ok: false, error: err.message };
  }
}

export async function sendLeadToTelegram(lead: Lead): Promise<{ok: boolean; messageId?: string; error?: string}> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return { ok: false, error: 'Missing Telegram credentials' };
  }

  // Part 1: Lead info (always send)
  const infoPart = `NOUVEAU LEAD

Prénom: ${lead.firstName}
Email: ${lead.email}
Mobile: ${lead.mobile}
Date: ${new Date(lead.date).toLocaleDateString('fr-FR')}`;

  const result1 = await sendTelegramMessage(infoPart);
  if (!result1.ok) {
    return result1;
  }

  // Part 2: Diagnosis (send separately if needed)
  const result2 = await sendTelegramMessage(`DIAGNOSTIC:\n\n${lead.diagnosis}`);

  return result2;
}
