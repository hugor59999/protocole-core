export async function sendDiagnosisViaWhatsApp(
  phoneNumber: string,
  firstName: string,
  profile: string
): Promise<boolean> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      console.log('Twilio credentials not configured');
      return false;
    }

    // Format phone number for Twilio (keep + and digits only)
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    const toNumber = `whatsapp:+${formattedPhone}`;
    const fromNumber = 'whatsapp:+14155238886'; // Twilio Sandbox number

    const message = `Salut ${firstName}! 👋\n\nTon diagnostic: ${profile}\n\nVa sur le lien pour voir les détails complets.`;

    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: toNumber,
          Body: message,
        }).toString(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Twilio API error:', error);
      return false;
    }

    console.log('WhatsApp message sent via Twilio');
    return true;
  } catch (err) {
    console.error('Twilio send error:', err);
    return false;
  }
}
