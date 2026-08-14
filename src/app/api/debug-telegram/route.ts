import { sendLeadToTelegram } from "@/lib/telegram-storage";

export async function POST(req: Request) {
  const body = await req.json();
  const { firstName, email, mobile, diagnosis } = body;

  if (!firstName || !email || !mobile || !diagnosis) {
    return Response.json({
      error: "Missing required fields",
      received: { firstName, email, mobile, hasDiagnosis: !!diagnosis }
    }, { status: 400 });
  }

  const testLead = {
    firstName,
    email,
    mobile,
    date: new Date().toISOString(),
    answers: ["test1", "test2", "test3", "test4", "test5", "test6"],
    diagnosis
  };

  console.log("[DEBUG-TELEGRAM] Starting test with:", testLead);

  try {
    const result = await sendLeadToTelegram(testLead);

    console.log("[DEBUG-TELEGRAM] Result:", result);

    return Response.json({
      ok: true,
      result: result,
      message: result.ok ? "✅ Message sent successfully to Telegram" : `❌ Failed: ${result.error}`,
      details: {
        telegramOk: result.ok,
        messageId: result.messageId,
        error: result.error,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error("[DEBUG-TELEGRAM] Exception:", err);

    return Response.json({
      ok: false,
      error: err.message || "Unknown error",
      stack: err.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
