import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { whatsapp, diagnosis } = body;

  if (!whatsapp || !diagnosis) {
    return NextResponse.json(
      { error: "WhatsApp number and diagnosis required" },
      { status: 400 }
    );
  }

  try {
    // Using Twilio to send WhatsApp message
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.error("Missing Twilio credentials");
      return NextResponse.json(
        { error: "WhatsApp service not configured" },
        { status: 500 }
      );
    }

    // Format WhatsApp number (ensure it has country code)
    const toNumber = whatsapp.startsWith("+") ? whatsapp : `+${whatsapp}`;

    // Send via Twilio
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${accountSid}:${authToken}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: `whatsapp:${fromNumber}`,
          To: `whatsapp:${toNumber}`,
          Body: diagnosis,
        }).toString(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Twilio error:", data);
      return NextResponse.json(
        { error: "Failed to send WhatsApp message" },
        { status: 500 }
      );
    }

    // Log the message send
    console.log(`[WhatsApp] Diagnostic sent to ${toNumber}`, data.sid);

    return NextResponse.json({
      success: true,
      messageSid: data.sid,
    });
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return NextResponse.json(
      { error: "Error sending WhatsApp message" },
      { status: 500 }
    );
  }
}
