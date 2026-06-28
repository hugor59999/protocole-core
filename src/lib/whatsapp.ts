export async function sendDiagnosisViaWhatsApp(
  phoneNumber: string,
  firstName: string,
  profile: string
): Promise<boolean> {
  try {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      console.log('WhatsApp API not configured yet');
      return false;
    }

    // Format phone number (remove non-digits)
    const formattedPhone = phoneNumber.replace(/\D/g, '');

    const message = `Salut ${firstName}! 👋\n\nTon diagnostic: *${profile}*\n\nVa sur le lien pour voir les détails complets.`;

    const response = await fetch(
      `https://graph.instagram.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: message,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('WhatsApp API error:', error);
      return false;
    }

    console.log('WhatsApp message sent successfully');
    return true;
  } catch (err) {
    console.error('WhatsApp send error:', err);
    return false;
  }
}
