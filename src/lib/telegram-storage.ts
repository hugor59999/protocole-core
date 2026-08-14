const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface Lead {
  firstName: string;
  email: string;
  mobile: string;
  date: string;
  answers: string[];
  diagnosis: string;
}

export async function sendLeadToTelegram(lead: Lead): Promise<{ok: boolean; messageId?: string; error?: string}> {
  console.log('[TELEGRAM] Starting sendLeadToTelegram', {
    hasToken: !!TELEGRAM_BOT_TOKEN,
    hasChatId: !!TELEGRAM_CHAT_ID,
    firstName: lead.firstName
  });

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('[TELEGRAM] Missing credentials:', {
      hasToken: !!TELEGRAM_BOT_TOKEN,
      hasChatId: !!TELEGRAM_CHAT_ID
    });
    return { ok: false, error: 'Missing credentials' };
  }

  const message = `🎯 NOUVEAU LEAD

👤 Prénom: ${lead.firstName}
📧 Email: ${lead.email}
📱 Mobile: ${lead.mobile}
📅 Date: ${new Date(lead.date).toLocaleDateString('fr-FR')}

📊 Réponses:
${lead.answers.map((a, i) => `Q${i + 1}: ${a}`).join('\n\n')}

🔍 Diagnostic:
${lead.diagnosis}`;

  try {
    console.log('[TELEGRAM] Preparing to send message to chat:', TELEGRAM_CHAT_ID);
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    const data = await response.json();
    console.log('[TELEGRAM] Response status:', response.status);
    console.log('[TELEGRAM] Response data:', data);

    if (!response.ok) {
      console.error('[TELEGRAM] Send failed:', response.statusText, data);
      return { ok: false, error: data.description || response.statusText };
    } else {
      console.log('[TELEGRAM] Lead sent successfully, message_id:', data.result?.message_id);
      return { ok: true, messageId: data.result?.message_id };
    }
  } catch (err) {
    console.error('[TELEGRAM] Exception:', err);
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
