import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstName, whatsapp, timestamp } = body;

  if (!firstName || !whatsapp) {
    return NextResponse.json(
      { error: "FirstName and WhatsApp number required" },
      { status: 400 }
    );
  }

  try {
    // Store lead data
    console.log(`[LEAD] Name: ${firstName}, WhatsApp: ${whatsapp}, Time: ${timestamp}`);

    // TODO: Implement actual storage
    // - Airtable: https://api.airtable.com/v0/{baseId}/{tableId}
    // - Telegram: Send notification with lead info
    // - Database: Store in your DB

    return NextResponse.json({
      success: true,
      stored: true,
    });
  } catch (error) {
    console.error("Error storing lead:", error);
    // Don't fail - this is non-critical
    return NextResponse.json({
      success: true,
      stored: false,
    });
  }
}
