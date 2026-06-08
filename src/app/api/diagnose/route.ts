import { NextRequest, NextResponse } from "next/server";
import { generateDiagnosis } from "@/lib/anthropic";
import { SCENARIOS } from "@/lib/scenarios";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const answers: unknown = body?.answers;

  if (
    !Array.isArray(answers) ||
    answers.length !== SCENARIOS.length ||
    answers.some((a) => typeof a !== "string" || !a.trim())
  ) {
    return NextResponse.json({ error: "Réponses invalides" }, { status: 400 });
  }

  try {
    const diagnosis = await generateDiagnosis(answers as string[]);
    return NextResponse.json({ diagnosis });
  } catch (err) {
    console.error("diagnose error", err);
    return NextResponse.json({ error: "Erreur lors de la génération du diagnostic" }, { status: 500 });
  }
}
