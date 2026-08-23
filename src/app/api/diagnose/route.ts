import { NextRequest, NextResponse } from "next/server";
import { generateDiagnosis } from "@/lib/anthropic";
import { QUIZ_QUESTIONS_V3 } from "@/lib/quiz-v3";

interface Answer {
  attachmentScore: "anxious" | "avoidant" | "disorganized" | "secure";
  nervousSystemScore: number;
}

interface ScoreResult {
  primaryAttachment: "anxious" | "avoidant" | "disorganized" | "secure";
  nervousSystemDysregulation: number;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const answers: unknown = body?.answers;

  if (
    !Array.isArray(answers) ||
    answers.length !== QUIZ_QUESTIONS_V3.length ||
    answers.some(
      (a) =>
        !a ||
        typeof a !== "object" ||
        !["anxious", "avoidant", "disorganized", "secure"].includes(
          a.attachmentScore
        ) ||
        typeof a.nervousSystemScore !== "number"
    )
  ) {
    return NextResponse.json({ error: "Réponses invalides" }, { status: 400 });
  }

  try {
    const diagnosis = await generateDiagnosis(answers as Answer[]);
    return NextResponse.json({ diagnosis });
  } catch (err) {
    console.error("diagnose error", err);
    return NextResponse.json(
      { error: "Erreur lors de la génération du diagnostic" },
      { status: 500 }
    );
  }
}
