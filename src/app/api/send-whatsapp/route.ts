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
    // Using Meta WhatsApp Business API
    const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.META_WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      console.error("Missing Meta WhatsApp credentials");
      return NextResponse.json(
        { error: "WhatsApp service not configured" },
        { status: 500 }
      );
    }

    // Format WhatsApp number (ensure it has country code)
    const toNumber = whatsapp.startsWith("+") ? whatsapp.replace("+", "") : whatsapp;

    // Send via Meta WhatsApp API
    const response = await fetch(
      `https://graph.instagram.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: toNumber,
          type: "text",
          text: {
            body: diagnosis,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Meta WhatsApp error:", data);
      return NextResponse.json(
        { error: "Failed to send WhatsApp message" },
        { status: 500 }
      );
    }

    // Log the message send and store the number
    console.log(`[WhatsApp] Diagnostic sent to +${toNumber}`, data.messages?.[0]?.id);

    // Store the lead with WhatsApp number (for follow-up)
    try {
      await fetch("/api/store-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp: `+${toNumber}`,
          messageSid: data.messages?.[0]?.id,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (storageError) {
      console.error("Error storing lead:", storageError);
      // Don't fail if storage fails - message was sent
    }

    return NextResponse.json({
      success: true,
      messageSid: data.messages?.[0]?.id,
    });
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return NextResponse.json(
      { error: "Error sending WhatsApp message" },
      { status: 500 }
    );
  }
}
