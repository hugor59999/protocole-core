import { NextRequest, NextResponse } from "next/server";
import { addLead as addLeadLocal } from "@/lib/storage";
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

    console.log("[SUBMIT] Received lead submission:", {
      firstName: lead.firstName,
      email: lead.email,
      mobile: lead.mobile,
      answersLength: lead.answers.length,
      hasQuiz: !!lead.diagnosis,
    });

    // Save locally (dev only)
    try {
      await addLeadLocal(lead);
      console.log("[SUBMIT] Lead saved to local storage");
    } catch (localErr) {
      console.error("[SUBMIT] Local storage save failed:", localErr);
    }

    // Send email (bonus, don't block on error)
    try {
      await sendDiagnosisEmail({ to: email.trim(), firstName: firstName.trim(), diagnosis });
      console.log("[SUBMIT] Email sent to:", email.trim());
    } catch (emailErr) {
      console.error("[SUBMIT] Email send error:", emailErr);
    }

    // Send to Telegram DIRECTLY (bypass sendLeadToTelegram function)
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      console.log("[SUBMIT] Sending to Telegram - token exists:", !!token, "chatId:", chatId);

      // Part 1: Info
      const infoPart = `NEW LEAD\n\nName: ${firstName}\nEmail: ${email}\nPhone: ${mobile}\nTime: ${lead.date}`;

      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: infoPart,
        }),
      }).then(r => r.json()).then(d => {
        console.log("[SUBMIT] Telegram Info sent, ok:", d.ok);

        // Part 2: Diagnosis
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `DIAGNOSIS:\n\n${diagnosis.substring(0, 3000)}`,
          }),
        }).then(r => r.json()).then(d => {
          console.log("[SUBMIT] Telegram Diagnosis sent, ok:", d.ok);
        });
      });
    } else {
      console.error("[SUBMIT] Telegram credentials missing - token:", !!token, "chatId:", !!chatId);
    }

    return NextResponse.json({
      ok: true,
      debug: {
        hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
        hasChatId: !!process.env.TELEGRAM_CHAT_ID,
        chatId: process.env.TELEGRAM_CHAT_ID || "NOT SET",
      }
    });
  } catch (err) {
    console.error("[SUBMIT] Error:", err);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement" }, { status: 500 });
  }
}
