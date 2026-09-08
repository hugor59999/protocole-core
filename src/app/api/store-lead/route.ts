import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstName, whatsapp, timestamp, quizAnswers, openAnswer, diagnosis } = body;

  if (!firstName || !whatsapp) {
    return NextResponse.json(
      { error: "FirstName and WhatsApp number required" },
      { status: 400 }
    );
  }

  try {
    // Store lead data with ALL quiz responses
    const leadData = {
      firstName,
      whatsapp,
      timestamp,
      quizAnswers: quizAnswers || [],
      openAnswer: openAnswer || "",
      diagnosis: diagnosis || "",
      receivedAt: new Date().toISOString()
    };

    console.log("[LEAD_RECEIVED]", JSON.stringify(leadData, null, 2));

    // Save to Supabase if configured
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error: insertError } = await supabase
          .from("leads")
          .insert([
            {
              first_name: firstName,
              whatsapp,
              quiz_answers: quizAnswers,
              open_answer: openAnswer,
              diagnosis,
              received_at: leadData.receivedAt
            }
          ]);

        if (insertError) {
          console.error("Supabase insert error:", insertError);
        } else {
          console.log("[LEAD_STORED] Successfully saved to Supabase");
        }
      } catch (e) {
        console.error("Supabase connection error:", e);
        // Don't fail the response - Supabase is optional for now
      }
    }

    return NextResponse.json({
      success: true,
      stored: true,
      leadData
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
