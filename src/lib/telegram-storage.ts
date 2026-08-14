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

export async function sendLeadToTelegram(lead: Lead): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials missing');
    return;
  }

  const message = `
🎯 **Nouveau Lead**

👤 **Prénom:** ${lead.firstName}
📧 **Email:** ${lead.email}
📱 **Mobile:** ${lead.mobile}
📅 **Date:** ${new Date(lead.date).toLocaleDateString('fr-FR')}

📊 **Réponses:**
${lead.answers.map((a, i) => `Q${i + 1}: ${a}`).join('\n')}

🔍 **Diagnostic:**
${lead.diagnosis}
`;

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      console.error('Telegram send failed:', response.statusText);
    } else {
      console.log('Lead sent to Telegram');
    }
  } catch (err) {
    console.error('Telegram error:', err);
  }
}
