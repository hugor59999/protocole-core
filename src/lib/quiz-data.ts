export interface QuizQuestion {
  id: number;
  question: string;
  options: Array<{
    letter: 'A' | 'B' | 'C' | 'D';
    text: string;
  }>;
}

export interface QuizProfile {
  id: 'anxious' | 'distant' | 'disorganized' | 'disconnected';
  title: string;
  subtitle: string;
  description: string;
  need: string;
  cta: string;
}

export const QUIZ_METADATA = {
  title: 'Pourquoi tu n\'arrives pas à passer à autre chose ?',
  subtitle: '7 questions pour comprendre ce que cette rupture révèle vraiment sur toi — et pourquoi tu risques de la revivre.',
  promise: 'En 3 minutes, découvre le mécanisme exact qui t\'a fait tomber aussi bas après cette rupture — et ce qu\'il dit de ton rapport aux relations depuis des années.',
} as const;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Depuis la rupture, ce qui t\'occupe le plus c\'est :',
    options: [
      { letter: 'A', text: 'Elle — elle est dans ta tête en permanence, tu analyses ce qui s\'est passé, tu cherches à comprendre' },
      { letter: 'B', text: 'Le vide — tu fonctionnes en surface mais quelque chose en toi est éteint' },
      { letter: 'C', text: 'L\'oscillation — des moments où tu vas bien, puis ça revient fort et tu te demandes si tu devrais pas la recontacter' },
      { letter: 'D', text: 'Rien de précis — tu ressens peu, tu ne sais pas vraiment ce qui se passe en toi' },
    ],
  },
  {
    id: 2,
    question: 'Ce qui fait le plus mal dans cette rupture c\'est :',
    options: [
      { letter: 'A', text: 'L\'incertitude — tu ne comprends pas vraiment pourquoi ça s\'est terminé comme ça' },
      { letter: 'B', text: 'La solitude — tu réalises que tu avais tout misé sur elle et que tu te retrouves seul avec toi-même' },
      { letter: 'C', text: 'La contradiction — une partie de toi voulait partir, une autre ne voulait pas la perdre' },
      { letter: 'D', text: 'Le manque — mais tu as du mal à savoir exactement ce qui te manque' },
    ],
  },
  {
    id: 3,
    question: 'Depuis la rupture, ton comportement ressemble plutôt à :',
    options: [
      { letter: 'A', text: 'Tu surveilles ses réseaux, tu analyses ses stories, tu te demandes si elle pense à toi' },
      { letter: 'B', text: 'Tu coupes tout contact immédiatement et tu gères seul — tu ne parles de ça à personne ou presque' },
      { letter: 'C', text: 'Tu passes entre vouloir la recontacter et te dire que c\'est mieux comme ça — plusieurs fois par jour' },
      { letter: 'D', text: 'Tu continues ta vie normalement, mais avec un fond de vide que tu n\'arrives pas à nommer' },
    ],
  },
  {
    id: 4,
    question: 'Si tu regardes tes relations passées, cette douleur-là :',
    options: [
      { letter: 'A', text: 'Tu l\'as déjà vécue — c\'est pas la première fois que ça finit comme ça' },
      { letter: 'B', text: 'C\'est la première fois que tu souffres autant — mais tu sens qu\'il y a quelque chose de plus profond' },
      { letter: 'C', text: 'Tu te souviens avoir vécu des hauts et des bas similaires dans d\'autres relations' },
      { letter: 'D', text: 'Tu as du mal à vraiment comparer — tu ressens peu en général' },
    ],
  },
  {
    id: 5,
    question: 'Si tu regardes tes 3 dernières relations, qu\'est-ce qui se répète ?',
    options: [
      { letter: 'A', text: 'Tu t\'attaches à des personnes émotionnellement peu disponibles ou distantes' },
      { letter: 'B', text: 'Tu commences fort puis tu te retrouves seul — tu t\'es éloigné sans vraiment savoir pourquoi' },
      { letter: 'C', text: 'Tu t\'approches, tu te retires, tu reviens — tu oscilles entre envie de fusionner et envie de fuir' },
      { letter: 'D', text: 'Tu t\'investis à fond, tu te fais avoir, et ça finit toujours de la même façon' },
    ],
  },
  {
    id: 6,
    question: 'La phrase qui te touche le plus profondément :',
    options: [
      { letter: 'A', text: '"J\'ai peur de ne pas être suffisant pour qu\'on reste."' },
      { letter: 'B', text: '"Je sais pas vraiment ce que je ressens — j\'ai du mal à y accéder."' },
      { letter: 'C', text: '"Je veux me rapprocher et en même temps quelque chose me pousse à fuir."' },
      { letter: 'D', text: '"Je m\'oublie dès que je suis en relation."' },
    ],
  },
  {
    id: 7,
    question: 'Au fond, ce que tu cherches vraiment à comprendre c\'est :',
    options: [
      { letter: 'A', text: 'Pourquoi ça finit toujours pareil, malgré tes efforts' },
      { letter: 'B', text: 'Pourquoi tu gardes tout le monde à distance même quand tu veux le contraire' },
      { letter: 'C', text: 'Pourquoi tu sabotes les relations qui pourraient vraiment marcher' },
      { letter: 'D', text: 'Pourquoi tu ressens si peu alors que tu veux ressentir plus' },
    ],
  },
];

export const QUIZ_PROFILES: Record<string, QuizProfile> = {
  anxious: {
    id: 'anxious',
    title: 'L\'ANXIEUX MASQUÉ',
    subtitle: '"Tu paniques en silence depuis des années."',
    description: `Tu as appris à paraître calme. Mais en intérieur, dès qu'une relation compte vraiment, ton système nerveux s'emballe. Tu surveilles les signaux, tu analyses les messages, tu fais des scénarios. Et tu caches tout ça parce qu'on t'a appris que montrer l'angoisse repousse.

Le résultat : tu es épuisant pour toi-même. Tu passes plus de temps à gérer ton anxiété intérieure qu'à vivre vraiment la relation. Et dès que l'autre se retire un peu, la spirale se déclenche — sur-analyse, sur-investissement, perte de toi-même.

Ce qui se passe vraiment : une peur d'abandon installée très tôt qui te fait vivre chaque relation comme si la fin était déjà là, imminente. Tu te bats contre quelque chose qui n'existe pas encore.`,
    need: 'comprendre d\'où vient cette alarme, apprendre à la traverser sans la fuir — et arrêter de te trahir pour garder l\'autre.',
    cta: 'Réserve ton diagnostic gratuit de 20 minutes',
  },
  distant: {
    id: 'distant',
    title: 'LE DISTANT MALGRÉ LUI',
    subtitle: '"Tu veux te connecter, mais quelque chose en toi résiste."',
    description: `Tu gardes une distance. Pas par manque d'envie — mais parce que s'approcher vraiment semble dangereux. Tu t'éloignes avant que l'autre puisse partir. Tu gères seul. Tu ne montres pas ce que tu ressens, parfois parce que tu n'y accèdes pas toi-même.

Le résultat : des relations qui restent en surface. Des femmes qui sentent qu'il y a quelque chose derrière ta façade mais n'arrivent jamais à l'atteindre. Et toi, qui te retrouves seul sans vraiment comprendre pourquoi.

Ce qui se passe vraiment : tu t'es construit une armure très tôt, probablement parce que s'ouvrir a été douloureux ou inutile à un moment clé. Aujourd'hui cette armure te protège — et t'emprisonne en même temps.`,
    need: 'retrouver l\'accès à ce que tu ressens — et t\'autoriser à exister pleinement dans une relation sans avoir à tout contrôler.',
    cta: 'Réserve ton diagnostic gratuit de 20 minutes',
  },
  disorganized: {
    id: 'disorganized',
    title: 'LE DÉSORGANISÉ',
    subtitle: '"Tu veux la relation. Et tu la sabotes en même temps."',
    description: `Tu t'approches, puis tu fuis. Tu t'investis fort, puis quelque chose te pousse à te retirer — sans que tu comprennes vraiment pourquoi. Tu peux passer de l'attachement intense à la froideur totale en quelques jours. Et ça te déroute autant que les femmes avec qui tu es.

Le résultat : des relations qui partent dans tous les sens. Des femmes qui ne savent pas où elles en sont avec toi — parce que toi non plus tu ne le sais pas vraiment. Et une frustration profonde : tu veux quelque chose de stable mais tu sèmes toi-même le chaos.

Ce qui se passe vraiment : deux besoins contradictoires actifs en même temps. Le besoin de connexion — et le besoin de sécurité qui associe la proximité à un danger. Quand quelqu'un s'approche vraiment, une alarme se déclenche. Quand il s'éloigne, tu paniques. Tu es pris entre les deux en permanence.`,
    need: 'comprendre les deux parties qui se battent en toi — et apprendre à créer de la sécurité intérieure pour ne plus avoir à fuir ce que tu désires.',
    cta: 'Réserve ton diagnostic gratuit de 20 minutes',
  },
  disconnected: {
    id: 'disconnected',
    title: 'LE COUPÉ',
    subtitle: '"Tu ressens peu. Mais tu veux ressentir plus."',
    description: `Face aux situations relationnelles, tu as du mal à identifier ce qui se passe en toi. Pas par indifférence — par déconnexion. À un moment, ton système a appris à couper le signal émotionnel avant même qu'il arrive. C'est devenu automatique.

Le résultat : tu fonctionnes, tu avances, tu n'as pas l'air d'être touché. Mais il y a un vide. Une impression de vivre tes relations de l'extérieur, comme spectateur. Et une vraie fatigue à ne pas savoir vraiment ce que tu veux ou ressens.

Ce qui se passe vraiment : une dissociation émotionnelle construite très tôt pour survivre dans un environnement où ressentir était dangereux ou inutile.`,
    need: 'retrouver le chemin vers toi-même — pas en forçant les émotions, mais en créant un espace sécurisé pour les laisser revenir.',
    cta: 'Réserve ton diagnostic gratuit de 20 minutes',
  },
};

export const PROFILE_MAPPING: Record<'A' | 'B' | 'C' | 'D', string> = {
  A: 'anxious',
  B: 'distant',
  C: 'disorganized',
  D: 'disconnected',
};
