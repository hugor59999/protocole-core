import Anthropic from "@anthropic-ai/sdk";
import { SCENARIOS } from "./scenarios";

const SYSTEM_PROMPT = `Tu es Hugo, expert de la psychologie masculine et des dynamiques relationnelles. Tu as accompagné plus de 500 hommes.
Tu analyses les réponses de cet homme à 6 scénarios relationnels à travers le prisme des styles d'attachement et des blessures de l'enfance.

Les 4 styles d'attachement à identifier :
- Anxieux : peur de l'abandon, hypervigilance, besoin de réassurance constant
- Évitant : fuite de l'intimité, déconnexion émotionnelle, indépendance excessive
- Désorganisé : mélange peur/désir d'intimité, comportements imprévisibles, trauma profond
- Sécure : confort avec l'intimité, régulation émotionnelle stable, limites claires

Les blessures de l'enfance à détecter :
- Manque de validation parentale → dépendance à l'approbation extérieure
- Amour conditionnel → se trahir pour être aimé
- Absence du père → rapport à l'autorité et à sa propre masculinité
- Instabilité émotionnelle familiale → hypervigilance dans les relations

Structure du diagnostic en 3 parties :
1. Ton style d'attachement dominant — nommé et expliqué simplement avec ses manifestations concrètes dans ses relations
2. La blessure profonde qui l'alimente — d'où ça vient, comment ça se manifeste aujourd'hui
3. Ce que ça révèle sur son rapport à lui-même — pas aux femmes

Règles absolues :
- Le sujet c'est LUI — pas les femmes
- Jamais de jugement — de la précision et de la bienveillance
- Parle-lui directement — pas de l'utilisateur ou il
- Ton humain, chaleureux, jamais robotique — pas de tirets à répétition
- Maximum 300 mots
- Termine par une phrase naturelle qui l'invite à aller plus loin avec Hugo`;

export async function generateDiagnosis(answers: string[]): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return getDemodiagnosis();
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const userContent = SCENARIOS.map(
      (scenario, i) => `Scénario ${i + 1} : ${scenario}\nRéponse : ${answers[i]}`
    ).join("\n\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Voici les réponses de cet homme aux 6 scénarios. Génère son diagnostic.\n\n${userContent}`,
        },
      ],
    });

    const block = message.content[0];
    return block.type === "text" ? block.text : getDemodiagnosis();
  } catch (err) {
    console.error("Anthropic API error:", err);
    return getDemodiagnosis();
  }
}

function getDemodiagnosis(): string {
  return `Ton style d'attachement : Anxieux avec tendances désorganisées

Ce que tu ressens, c'est de l'anxiété relationnelle profonde. Tu t'abandonnes dans tes relations parce que tu cherches avant tout la validation externe — pas parce que tu es "faible", mais parce que c'est une stratégie de survie apprise. Quelque part dans ton enfance, l'amour n'était pas constant. Il était conditionnel, imprévisible, parfois retiré.

La blessure qui l'alimente

Ton système nerveux a appris à scanner l'environnement pour savoir si tu es "assez". Un parent absent, absent émotionnellement, ou trop présent et instable — peu importe. Ce que tu as intériorisé, c'est que ta valeur dépend de comment l'autre te regarde. Donc tu adaptes, tu te diminues, tu donnes tout pour garder la relation. Paradoxalement, plus tu te donnes, plus tu te perds.

Ce que ça révèle sur toi

Le travail réel n'est pas sur les relations — c'est sur toi. Tu dois retrouver la confiance en ta propre valeur. Non pas grâce à une femme. Grâce à toi. Parce qu'actuellement, tu donnes ton pouvoir à l'autre, et c'est épuisant pour vous deux.

La bonne nouvelle ? C'est apprenable. Tu peux construire une base de sécurité interne qui ne dépend pas du jugement de l'autre.`;
}
