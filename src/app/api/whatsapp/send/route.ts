import { sendDiagnosisViaWhatsApp } from '@/lib/whatsapp';

export async function POST(request: Request) {
  try {
    const { phoneNumber, firstName, profile } = await request.json();

    if (!phoneNumber || !firstName || !profile) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const success = await sendDiagnosisViaWhatsApp(phoneNumber, firstName, profile);

    return Response.json({
      success,
      message: success
        ? 'Diagnosis sent via WhatsApp'
        : 'WhatsApp API not configured (message not sent)',
    });
  } catch (err) {
    console.error('WhatsApp send error:', err);
    return Response.json(
      { error: (err as any).message || 'Failed to send' },
      { status: 500 }
    );
  }
}
