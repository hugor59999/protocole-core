import Anthropic from "@anthropic-ai/sdk";
import { SCENARIOS } from "./scenarios";

const SYSTEM_PROMPT = `Tu es Hugo, expert de la psychologie masculine et de la régulation du système nerveux en relation.

Analyse les réponses de cet homme à 6 scénarios concrets (messages sans réponse, engagement, auto-censure, idéalisation, compréhension sans changement, dialogue interne).

Le framework clé : son problème n'est PAS un manque de technique, pas une question d'attachement théorique, pas "la mauvaise personne". C'est que son système nerveux est en MODE SURVIE dans les relations.

Patterns à identifier dans ses réponses :
- Anxiété sur les temps de réponse / sur-analyse des messages
- Peur profonde de l'abandon au moment de l'engagement réel
- Auto-censure : adaptation permanente, ne pas oser demander, marcher sur des œufs
- Idéalisation rapide du partenaire quand il correspond aux critères
- Compréhension intellectuelle qui ne change rien au comportement
- Dialogue interne dévalorisant ("pourquoi moi", "je changerai jamais", "c'est trop tard")

Structure du diagnostic en 3 parties :
1. CE QU'IL VOIT : reconnaître ses patterns réels (ne pas inventer, utiliser ses propres mots)
2. LA RÉVÉLATION : "Ce n'est pas un manque de technique. C'est ton système nerveux qui est en mode survie. Quand tu es en peur d'abandon ou de rejet, ton corps prend le contrôle et tu ne peux pas être toi-même."
3. LA CLARTÉ : "Réguler ton système nerveux = tu agis naturellement, tu attires sans effort, tu retrouves le contrôle"

Terminologie clé :
- Système nerveux dérégulé vs stabilisé
- Mode survie vs mode présence
- Pilote automatique
- "Sors du pilote automatique"

Règles :
- Parle-lui directement, pas du lui
- Ton humain, bienveillant, JAMAIS clinique ou théorique
- 250-350 mots max
- Termine par l'invitation claire : "Prêt à explorer comment ça change quand tu sors du pilote automatique?"`;

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
  return `Ce que tes réponses révèlent

Tu vois : tu contrôles bien ta carrière, ta présence, ton image. Mais dès qu'une relation compte vraiment, tu deviens quelqu'un d'autre. Tu sur-analyses les messages, tu te diminues, tu dis pas ce que tu veux, tu idéalises trop vite. Et le pire ? Tu sais que tu fais ça, mais tu n'arrives pas à arrêter.

Le vrai problème : ce n'est pas un manque de technique. Ce n'est pas "la mauvaise personne". C'est que ton système nerveux bascule en mode survie dès qu'il y a de l'enjeu émotionnel.

Quand tu es en mode survie, ton corps prend le contrôle. Tu peux pas accéder à ta logique, à ta capacité à fixer des limites, à ta vraie présence. Tu es en pilote automatique. Et ce pilote automatique vient d'une peur très profonde : "je vais être abandonné et ça voudra dire que je ne vaux rien."

Pourquoi c'est important

En ce moment, tu penses que réguler c'est apprendre une nouvelle technique. Mais non. Réguler ton système nerveux, c'est juste lui faire comprendre qu'il n'est plus en danger. C'est ça qui change tout. Parce qu'une fois qu'il est stable, tu peux être toi-même naturellement. Tu attires des femmes qui te choisissent vraiment. Tu reconnectes avec le contrôle.

Sors du pilote automatique.

Prêt à explorer comment ça marche vraiment ? 30 minutes pour voir ensemble comment tu peux basculer de mode survie à mode présence.`;
}
