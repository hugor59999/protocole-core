import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function sendViaWhatsApp(
  phoneNumber: string,
  message: string
): Promise<boolean> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      console.log('Twilio credentials not configured');
      return false;
    }

    const formattedPhone = phoneNumber.replace(/\D/g, '');
    const toNumber = `whatsapp:+${formattedPhone}`;
    const fromNumber = 'whatsapp:+14155238886';

    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: toNumber,
          Body: message,
        }).toString(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Twilio error:', error);
      return false;
    }

    console.log('WhatsApp message sent');
    return true;
  } catch (err) {
    console.error('WhatsApp send error:', err);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { firstName, whatsapp, answers } = await request.json();

    if (!firstName || !whatsapp || !answers || answers.length !== 7) {
      return Response.json(
        { error: 'Invalid data' },
        { status: 400 }
      );
    }

    // Build prompt for Claude
    const prompt = `Tu es Hugo Raverdy, coach en transformation masculine, créateur de Protocole Core.
Un homme vient de répondre à 7 questions sur ses schémas relationnels post-rupture.

TON RÔLE : générer un diagnostic personnalisé de 200-300 mots qui va le toucher au plus profond — parce qu'il se reconnaît dans chaque phrase.

RÈGLES ABSOLUES :
- Utilise SES mots et SES formulations — pas les tiens
- Parle-lui directement (tu), commence par son prénom
- Zéro jargon psychologique (pas de "attachement anxieux", "système nerveux", "anima")
- Nomme le mécanisme exact avec une précision chirurgicale
- Le sujet c'est toujours LUI — jamais elle
- Termine par une phrase d'ouverture naturelle vers un appel de 20 minutes

CADRE PHILOSOPHIQUE : les relations sont un miroir qui révèle ses schémas internes. La rupture n'est pas le problème — elle révèle quelque chose de plus profond sur lui.

CE QUE TU CHERCHES DANS SES RÉPONSES :
- Le déclencheur exact (qu'est-ce qui active la spirale ?)
- Le comportement réactif (ce qu'il fait quand ça monte)
- La blessure centrale (peur d'abandon, insuffisance, rejet, trahison)
- Le pattern répétitif (ce qui se rejoue de relation en relation)
- Sa lucidité sur lui-même (a-t-il déjà commencé à voir ?)

STRUCTURE DU DIAGNOSTIC :
1. Une phrase d'accroche qui nomme son pattern avec ses mots (pas une généralité)
2. Le mécanisme exact — ce qui se passe vraiment en lui quand la spirale démarre
3. L'origine probable — sans psychanalyse, juste une observation précise
4. Ce que ça lui coûte concrètement
5. Une phrase de clôture qui ouvre vers l'appel — naturelle, pas commerciale

RÉPONSES DU PROSPECT :
Prénom : ${firstName}
Q1 : ${answers[0]}
Q2 : ${answers[1]}
Q3 : ${answers[2]}
Q4 : ${answers[3]}
Q5 : ${answers[4]}
Q6 : ${answers[5]}
Q7 : ${answers[6]}`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const diagnosis = message.content[0].type === 'text' ? message.content[0].text : '';

    if (!diagnosis) {
      return Response.json(
        { error: 'Failed to generate diagnosis' },
        { status: 500 }
      );
    }

    // Send via WhatsApp
    await sendViaWhatsApp(whatsapp, diagnosis);

    return Response.json({
      success: true,
      message: 'Diagnosis sent',
    });
  } catch (err) {
    console.error('Quiz error:', err);
    return Response.json(
      { error: (err as any).message || 'Server error' },
      { status: 500 }
    );
  }
}
