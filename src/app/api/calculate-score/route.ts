import { NextRequest, NextResponse } from "next/server";

interface ScoreResult {
  primaryAttachment: "anxious" | "avoidant" | "disorganized" | "secure";
  nervousSystemDysregulation: number; // 0-100
  attachmentScores: {
    anxious: number;
    avoidant: number;
    disorganized: number;
    secure: number;
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { answers } = body;

  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json(
      { error: "Invalid answers array" },
      { status: 400 }
    );
  }

  // Count attachment style scores
  const scores = {
    anxious: 0,
    avoidant: 0,
    disorganized: 0,
    secure: 0,
  };

  const nervousSystemScores: number[] = [];

  answers.forEach(
    (answer: { attachment: string; nervousSystem: number }) => {
      scores[answer.attachment as keyof typeof scores]++;
      nervousSystemScores.push(answer.nervousSystem);
    }
  );

  // Find primary attachment
  let primaryAttachment: "anxious" | "avoidant" | "disorganized" | "secure" =
    "secure";
  let maxScore = scores.secure;

  Object.entries(scores).forEach(([key, value]) => {
    if (value > maxScore) {
      maxScore = value;
      primaryAttachment = key as typeof primaryAttachment;
    }
  });

  // Calculate average nervous system dysregulation
  const nervousSystemDysregulation = Math.round(
    (nervousSystemScores.reduce((a, b) => a + b, 0) /
      nervousSystemScores.length) *
      10
  );

  return NextResponse.json({
    primaryAttachment,
    nervousSystemDysregulation,
    attachmentScores: scores,
  } as ScoreResult);
}
