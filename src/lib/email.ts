import { Resend } from "resend";

export async function sendDiagnosisEmail(params: {
  to: string;
  firstName: string;
  diagnosis: string;
}): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "";

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #111; line-height: 1.6;">
      <p>Salut ${params.firstName},</p>
      <p>Voici ton diagnostic complet, tel que je l'ai vu en analysant tes réponses :</p>
      <div style="white-space: pre-wrap; border-left: 2px solid #111; padding-left: 16px; margin: 24px 0;">
        ${params.diagnosis.replace(/\n/g, "<br/>")}
      </div>
      <p>Si tu veux qu'on aille plus loin ensemble et qu'on regarde comment transformer ça concrètement, réserve un créneau avec moi :</p>
      <p style="margin: 24px 0;">
        <a href="${calendlyUrl}" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
          Réserver un appel avec Hugo
        </a>
      </p>
      <p>À bientôt,<br/>Hugo</p>
    </div>
  `;

  await resend.emails.send({
    from: "Hugo - Protocole Core <hugo@protocole-core.com>",
    to: params.to,
    subject: "Ton diagnostic Protocole Core",
    html,
  });
}
