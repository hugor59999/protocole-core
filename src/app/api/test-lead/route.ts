import { sendLeadToTelegram } from "@/lib/telegram-storage";

export async function GET() {
  const testLead = {
    firstName: "TestUser",
    email: "test@example.com",
    mobile: "+33612345678",
    date: new Date().toISOString(),
    answers: ["Answer 1", "Answer 2", "Answer 3", "Answer 4", "Answer 5", "Answer 6"],
    diagnosis: "🔧 This is a test diagnosis from /api/test-lead endpoint"
  };

  console.log("[TEST-LEAD] Starting test...");

  try {
    const result = await sendLeadToTelegram(testLead);
    return Response.json({
      success: result.ok,
      telegramResponse: result,
      message: result.ok ? "Test lead sent to Telegram" : `Failed: ${result.error}`,
      lead: testLead
    });
  } catch (err: any) {
    return Response.json({
      success: false,
      error: err.message,
      stack: err.stack
    }, { status: 500 });
  }
}
