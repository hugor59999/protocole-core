import { NextRequest, NextResponse } from "next/server";
import { addLead as addLeadLocal } from "@/lib/storage";
import { createLead as addLeadAirtable } from "@/lib/airtable";
import { sendDiagnosisEmail } from "@/lib/email";
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
    // Try Airtable first (production)
    try {
      await addLeadAirtable(leadData);
      console.log("Lead saved to Airtable");
    } catch (airtableErr) {
      console.error("Airtable save failed, trying local storage:", airtableErr);
      // Fallback to local storage
      await addLeadLocal({
        ...leadData,
        date: new Date().toISOString(),
      });
      console.log("Lead saved to local storage");
    }

    // Send email (bonus, don't block on error)
    try {
      await sendDiagnosisEmail({ to: email.trim(), firstName: firstName.trim(), diagnosis });
    } catch (emailErr) {
      console.error("Email send error (lead saved anyway):", emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("submit error", err);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement" }, { status: 500 });
  }
}
