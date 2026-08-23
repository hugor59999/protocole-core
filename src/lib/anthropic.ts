import Anthropic from "@anthropic-ai/sdk";
import { SCENARIOS } from "./scenarios";

const SYSTEM_PROMPT = `Tu es Hugo, expert de la psychologie masculine et de la régulation du système nerveux en relation.

Analyse les réponses de cet homme à 8 scénarios réels :
1. Messages sans réponse / anxiété
2. Engagement / peur
3. Auto-censure / adaptation
4. Idéalisation rapide
5. Sur-don
6. Compréhension intellectuelle sans changement
7. Sensation physique avant des moments importants
8. Dialogue interne après rejet

Framework : combine SYSTÈME NERVEUX + ATTACHEMENT
- Son problème n'est pas un manque de technique ni "la mauvaise personne"
- C'est un système nerveux dérégulé qui active un style d'attachement
- L'attachement (anxieux/évitant/désorganisé) EST la manifestation du système nerveux en mode survie

Patterns à reconnaître :
- Attachement ANXIEUX = système nerveux hyperactivé : peur constante, besoin de réassurance, sur-don
- Attachement ÉVITANT = système nerveux en shutdown : fermeture émotionnelle, fuite de l'intimité
- Attachement DÉSORGANISÉ = dysrégulation extrême : oscille entre panique et fuite
- Attachement SÉCURE = système nerveux régulé : présence, confiance, équilibre

Structure du diagnostic en 4 parties :
1. CE QU'IL MONTRE : ses patterns réels (reprendre ses propres mots quand c'est fort)
2. SON ATTACHEMENT : nommer le style d'attachement qu'il manifeste
3. LA RÉVÉLATION : "C'est pas une question de technique. C'est que ton système nerveux est dérégulé — il pense que la relation est dangereuse. C'est du pilote automatique."
4. LA SOLUTION : "Réguler ton système nerveux = sécurité interne = tu peux être toi-même naturellement"

Phrase clé : "Sors du pilote automatique."

Règles :
- Parle-lui directement
- Identifie le style d'attachement clairement
- Connecte-le au système nerveux (pas juste la théorie)
- Utilise ses propres mots quand c'est révélateur
- Ton humain, pas clinique
- 300-400 mots max
- Termine par l'invitation : "Prêt à explorer comment tu sors du pilote automatique?"`;

interface Answer {
  attachmentScore: "anxious" | "avoidant" | "disorganized" | "secure";
  nervousSystemScore: number;
}

export async function generateDiagnosis(answers: Answer[]): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return getDemodiagnosis();
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const userContent = SCENARIOS.map(
      (scenario, i) =>
        `Scénario ${i + 1} : ${scenario}\nRéponse : Attachement ${answers[i].attachmentScore} (dysrégulation nerveuse: ${answers[i].nervousSystemScore}/10)`
    ).join("\n\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Voici les réponses de cet homme aux 8 scénarios. Génère son diagnostic en combinant système nerveux + attachement.\n\n${userContent}`,
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

Tu contrôles bien ta vie extérieure — le business, l'image, la présence. Mais en relation, ça change complètement. Tu sur-analyses les messages, tu te censures pour ne pas la perdre, tu donnes trop, tu l'idéalises rapidement. Puis une fois que tu as compris tes patterns, rien ne change vraiment. C'est comme si ton corps n'avait pas reçu l'information.

Ton attachement : ANXIEUX avec activation du système nerveux
Ton système nerveux se perçoit en danger émotionnel. Il signale "perte d'amour = danger existentiel". Donc il active des protections : sur-interprétation des messages, besoin constant de réassurance, auto-censure, sur-don. C'est pas de l'indiscipline. C'est du pilote automatique.

Le vrai problème
Ce n'est pas un manque de technique. Ce n'est pas elle. C'est que ton système nerveux est dérégulé dans les relations. Il croit que tu vas être abandonné = que tu ne vaux rien. Et il agit à partir de cette croyance avant que tu puisses même penser.

Pourquoi la compréhension seule ne change rien
Ton cerveau a compris. Ton corps ne l'a pas compris. Réguler le système nerveux, c'est passer du mode survie au mode présence. Pas par la compréhension. Par la régulation.

Quand c'est régulé :
- Tu peux être toi-même naturellement (pas d'effort)
- Tu attires sans technique
- Tu as du contrôle et de la paix

Sors du pilote automatique.

Prêt à explorer comment tu peux vraiment réguler ça et retrouver le contrôle en relation?`;
}
