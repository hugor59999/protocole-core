import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/airtable";
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

  try {
    await createLead({
      firstName: firstName.trim(),
      email: email.trim(),
      mobile: typeof mobile === "string" ? mobile.trim() : "",
      answers,
      diagnosis,
    });

    await sendDiagnosisEmail({ to: email.trim(), firstName: firstName.trim(), diagnosis });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("submit error", err);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement" }, { status: 500 });
  }
}
