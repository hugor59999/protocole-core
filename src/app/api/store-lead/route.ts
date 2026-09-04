import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { whatsapp, messageSid, timestamp } = body;

  if (!whatsapp) {
    return NextResponse.json(
      { error: "WhatsApp number required" },
      { status: 400 }
    );
  }

  try {
    // Store lead data
    // Options:
    // 1. Save to Airtable
    // 2. Save to database (Supabase, MongoDB, etc)
    // 3. Save to file storage
    // 4. Send to Telegram/Discord for logging

    // For now, log it
    console.log(`[LEAD] WhatsApp: ${whatsapp}, MessageSid: ${messageSid}, Time: ${timestamp}`);

    // TODO: Implement actual storage
    // - Airtable: https://api.airtable.com/v0/{baseId}/{tableId}
    // - Telegram: Send notification with whatsapp number
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
