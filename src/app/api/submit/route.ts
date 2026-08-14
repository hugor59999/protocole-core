import { NextRequest, NextResponse } from "next/server";
import { addLead as addLeadLocal } from "@/lib/storage";
import { addLeadSupabase } from "@/lib/supabase-storage";
import { sendDiagnosisEmail } from "@/lib/email";
import { sendLeadToTelegram } from "@/lib/telegram-storage";
import { SCENARIOS } from "@/lib/scenarios";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstName, email, mobile, answers, diagnosis } = body || {};

  if (
    typeof firstName !== "string" ||
    !firstName.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof diagnosis !== "string" ||
    !diagnosis.trim() ||
    !Array.isArray(answers) ||
    answers.length !== SCENARIOS.length
  ) {
    return NextResponse.json({ error: "Champs invalides" }, { status: 400 });
  }

  const leadData = {
    firstName: firstName.trim(),
    email: email.trim(),
    mobile: typeof mobile === "string" ? mobile.trim() : "",
    answers,
    diagnosis,
  };

  try {
    const lead = {
      ...leadData,
      date: new Date().toISOString(),
    };

    // Try local storage (primary method - works in dev, fallback in prod)
    try {
      await addLeadLocal(lead);
      console.log("Lead saved to local storage");
    } catch (localErr) {
      console.error("Local storage save failed:", localErr);
    }

    // Try Supabase in background (don't block)
    addLeadSupabase(lead).catch(err => {
      console.error("Supabase save failed (background):", err?.message || err);
    });

    // Send email (bonus, don't block on error)
    try {
      await sendDiagnosisEmail({ to: email.trim(), firstName: firstName.trim(), diagnosis });
    } catch (emailErr) {
      console.error("Email send error (lead saved anyway):", emailErr);
    }

    // Send to Telegram (permanent backup)
    sendLeadToTelegram(lead).catch(err => {
      console.error("Telegram send failed (background):", err);
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("submit error", err);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement" }, { status: 500 });
  }
}
