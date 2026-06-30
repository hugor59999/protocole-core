import { Anthropic } from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

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
    const whatsappFromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !whatsappFromNumber) {
      console.log('Twilio credentials not configured');
      return false;
    }

    const formattedPhone = phoneNumber.replace(/\D/g, '');
    const toNumber = `whatsapp:+${formattedPhone}`;
    const fromNumber = whatsappFromNumber;

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
Un homme vient de répondre à 7 questions sur ses schémas relationnels après une rupture.
Ta mission : générer un diagnostic personnalisé de 200-300 mots qui le touche au plus profond — parce qu'il se reconnaît dans chaque phrase.

RÈGLES ABSOLUES
- Utilise SES mots et SES formulations — pas les tiens
- Commence par son prénom
- Parle-lui directement (tu), ton chaleureux mais direct
- Zéro jargon psychologique (pas de "attachement anxieux", "système nerveux", "anima", "style d'attachement")
- Le sujet c'est toujours LUI — jamais elle
- Termine par une phrase d'ouverture naturelle vers un échange de 20 minutes
- Maximum 300 mots

CADRE PHILOSOPHIQUE
Les relations sont un miroir. La rupture n'est pas le problème — elle révèle quelque chose de plus profond sur lui. Ce qu'il cherche chez l'autre, il ne se le donne pas encore à lui-même.

STRUCTURE DU DIAGNOSTIC
1. Une phrase d'accroche qui nomme son mécanisme exact avec SES mots (pas une généralité)
2. Ce qui se passe vraiment en lui quand la spirale démarre
3. Ce que ça lui coûte concrètement dans sa vie
4. La blessure centrale nommée sans jargon
5. Une phrase de clôture qui ouvre vers l'échange — naturelle, pas commerciale

SIGNAUX À DÉTECTER
**Anxieux masqué** — s'attache vite, sur-analyse les signaux, panique cachée, sur-investit puis se fait ghoster, "ça finit toujours pareil", peur de l'abandon formulée ou implicite

**Évitant / distant malgré lui** — "je sais pas ce que je ressens", se renferme, fonctionnait en détaché, s'ouvre quand l'autre part, gère seul, culpabilité de ne pas s'être battu

**Désorganisé** — oscille entre vouloir la relation et fuir, se rapproche puis se retire, chaud-froid, sabote quand ça pourrait vraiment marcher

**Coupé** — vide, peu d'accès aux émotions, fonctionne normalement en surface, la douleur est là mais floue

RÉPONSES DU PROSPECT
Prénom : ${firstName}
Q1 — Ce qui se passe depuis la rupture : ${answers[0]}
Q2 — Ce qui fait le plus mal : ${answers[1]}
Q3 — Comportement depuis la rupture : ${answers[2]}
Q4 — Ce que tu as déjà vécu de similaire : ${answers[3]}
Q5 — Ce qui se répète dans tes relations : ${answers[4]}
Q6 — La phrase qui te touche le plus : ${answers[5]}
Q7 — Ce que tu cherches vraiment à comprendre : ${answers[6]}

Génère maintenant le diagnostic personnalisé pour ce prospect.`;

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

    // Save to Supabase FIRST
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from('quiz_results')
      .insert([
        {
          first_name: firstName,
          whatsapp,
          email: null,
          profile: null,
          answers: JSON.stringify(answers),
          diagnosis,
          created_at: new Date().toISOString(),
        },
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
      return Response.json(
        { error: 'Failed to save to database: ' + dbError.message },
        { status: 500 }
      );
    }

    // Send via WhatsApp AFTER saving
    const whatsappSent = await sendViaWhatsApp(whatsapp, diagnosis);

    if (!whatsappSent) {
      console.error('WhatsApp send failed for:', whatsapp);
      // Still return success since data was saved
    }

    return Response.json({
      success: true,
      message: 'Diagnosis saved and sent',
    });
  } catch (err) {
    console.error('Quiz error:', err);
    return Response.json(
      { error: (err as any).message || 'Server error' },
      { status: 500 }
    );
  }
}
