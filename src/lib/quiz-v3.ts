export interface QuizQuestion {
  id: string;
  question: string;
  answers: {
    key: "A" | "B" | "C" | "D";
    text: string;
    attachmentScore: "anxious" | "avoidant" | "disorganized" | "secure";
    nervousSystemScore: number; // 0-10 dysregulation level
  }[];
}

export const QUIZ_QUESTIONS_V3: QuizQuestion[] = [
  {
    id: "message_anxiety",
    question: "Elle met 3-4h à répondre à tes messages. Qu'est-ce qui se passe vraiment en toi?",
    answers: [
      {
        key: "A",
        text: "Tu panique, tu relis tes messages 10x pour voir si tu as dit quelque chose de mal",
        attachmentScore: "anxious",
        nervousSystemScore: 9
      },
      {
        key: "B",
        text: "Tu t'en fous un peu, tu lui réponds quand tu as envie, pas de stress",
        attachmentScore: "avoidant",
        nervousSystemScore: 3
      },
      {
        key: "C",
        text: "Tu hésites entre la panique et l'indifférence — parfois tu la harcèles, parfois tu disparais",
        attachmentScore: "disorganized",
        nervousSystemScore: 8
      },
      {
        key: "D",
        text: "Tu remarques que tu as un petit pic d'anxiété mais tu fais confiance — tu sais qu'elle répond quand elle peut",
        attachmentScore: "secure",
        nervousSystemScore: 2
      }
    ]
  },
  {
    id: "engagement_fear",
    question: "Vous commencez à parler d'avenir (relation sérieuse). Qu'est-ce que tu ressens?",
    answers: [
      {
        key: "A",
        text: "Tu panique intérieurement — peur qu'elle te laisse une fois que tu es vraiment engagé",
        attachmentScore: "anxious",
        nervousSystemScore: 9
      },
      {
        key: "B",
        text: "Tu freines, tu deviens distant, tu te dis 'c'est trop' et tu commences à chercher une sortie",
        attachmentScore: "avoidant",
        nervousSystemScore: 7
      },
      {
        key: "C",
        text: "Ça change ton humeur d'un jour à l'autre — tantôt tu veux tout, tantôt tu veux fuir",
        attachmentScore: "disorganized",
        nervousSystemScore: 9
      },
      {
        key: "D",
        text: "Tu sens une légère appréhension (normal) mais tu peux en parler avec elle naturellement",
        attachmentScore: "secure",
        nervousSystemScore: 3
      }
    ]
  },
  {
    id: "self_censorship",
    question: "Tu veux quelque chose dans la relation (espace, une conversation difficile, tes besoins). Qu'est-ce qui se passe?",
    answers: [
      {
        key: "A",
        text: "Tu te censures presque, tu marches sur des œufs pour ne pas la perdre ou la déranger",
        attachmentScore: "anxious",
        nervousSystemScore: 8
      },
      {
        key: "B",
        text: "Tu en parlais jamais vraiment, tu fais ton truc de ton côté, indépendant et fermé",
        attachmentScore: "avoidant",
        nervousSystemScore: 6
      },
      {
        key: "C",
        text: "Tu l'explodes à la figure quand t'en peux plus, puis tu te culpabilises et tu t'excuses trop",
        attachmentScore: "disorganized",
        nervousSystemScore: 8
      },
      {
        key: "D",
        text: "Tu trouves le moment, tu dis ce que tu penses avec respect, et tu peux gérer sa réaction",
        attachmentScore: "secure",
        nervousSystemScore: 2
      }
    ]
  },
  {
    id: "idealization",
    question: "Après 2-3 semaines, elle correspond à tes critères. Comment tu la vois?",
    answers: [
      {
        key: "A",
        text: "Elle est presque parfaite — tu la mets sur un piédestal sans vraiment la connaître",
        attachmentScore: "anxious",
        nervousSystemScore: 8
      },
      {
        key: "B",
        text: "Tu minimises ses qualités mentalement, tu trouves toujours un défaut pour rester distant",
        attachmentScore: "avoidant",
        nervousSystemScore: 5
      },
      {
        key: "C",
        text: "Tu oscilles — elle est géniale un jour, et tu vois tous ses défauts le lendemain",
        attachmentScore: "disorganized",
        nervousSystemScore: 8
      },
      {
        key: "D",
        text: "Tu vois ses qualités ET ses défauts — tu l'apprécies sans l'idéaliser",
        attachmentScore: "secure",
        nervousSystemScore: 2
      }
    ]
  },
  {
    id: "over_giving",
    question: "Dès que la relation commence à compter, qu'est-ce que tu fais?",
    answers: [
      {
        key: "A",
        text: "Tu donnes beaucoup — trop de cadeaux, trop de temps, tu t'oublies pour la garder",
        attachmentScore: "anxious",
        nervousSystemScore: 8
      },
      {
        key: "B",
        text: "Tu donnes très peu — tu gardes ton indépendance et tu fuis l'intimité",
        attachmentScore: "avoidant",
        nervousSystemScore: 6
      },
      {
        key: "C",
        text: "Tu donnes énormément puis tu reviens en arrière d'un coup — tu te sens exploité",
        attachmentScore: "disorganized",
        nervousSystemScore: 8
      },
      {
        key: "D",
        text: "Tu donnes généreusement mais pas aux dépens de toi-même — tu restes équilibré",
        attachmentScore: "secure",
        nervousSystemScore: 2
      }
    ]
  },
  {
    id: "intellectual_change",
    question: "Tu as compris tes schémas (therapie, lectures, coaching). Mais en relation?",
    answers: [
      {
        key: "A",
        text: "Tu les répètes quand même... c'est comme si ton corps ne l'avait pas compris",
        attachmentScore: "anxious",
        nervousSystemScore: 8
      },
      {
        key: "B",
        text: "Tu intellectualises beaucoup mais tu restes fermé émotionnellement — rien ne change vraiment",
        attachmentScore: "avoidant",
        nervousSystemScore: 6
      },
      {
        key: "C",
        text: "C'est incontrôlable — tu comprends mais une force en toi agit quand même",
        attachmentScore: "disorganized",
        nervousSystemScore: 9
      },
      {
        key: "D",
        text: "Ça t'a vraiment changé — tu agis différemment même quand c'est dur",
        attachmentScore: "secure",
        nervousSystemScore: 2
      }
    ]
  },
  {
    id: "physical_sensation",
    question: "Avant une date importante ou un moment difficile en relation, tu ressens?",
    answers: [
      {
        key: "A",
        text: "Une boule dans la poitrine/estomac, de l'anxiété qui monte, le cœur qui s'accélère",
        attachmentScore: "anxious",
        nervousSystemScore: 9
      },
      {
        key: "B",
        text: "Tu te fermes émotionnellement, c'est engourdi, tu ne sens rien ou très peu",
        attachmentScore: "avoidant",
        nervousSystemScore: 5
      },
      {
        key: "C",
        text: "Une activation intense — soit trop d'anxiété, soit une agressivité qui monte",
        attachmentScore: "disorganized",
        nervousSystemScore: 9
      },
      {
        key: "D",
        text: "Un léger inconfort mais tu restes ancré — tu peux respirer et continuer",
        attachmentScore: "secure",
        nervousSystemScore: 2
      }
    ]
  },
  {
    id: "internal_dialogue",
    question: "Après un moment difficile en relation ou un rejet, tu te dis?",
    answers: [
      {
        key: "A",
        text: '"Je ne vaux rien" / "Je ne suis pas assez" / "Pourquoi moi toujours?"',
        attachmentScore: "anxious",
        nervousSystemScore: 8
      },
      {
        key: "B",
        text: '"Elle a pas compris" / "Personne ne peut vraiment me connaître" / "Je vais seul"',
        attachmentScore: "avoidant",
        nervousSystemScore: 6
      },
      {
        key: "C",
        text: '"Je suis une merde" puis "elle était pourrie de toute façon" — les deux extrêmes"',
        attachmentScore: "disorganized",
        nervousSystemScore: 9
      },
      {
        key: "D",
        text: "C'est dommage mais c'est OK, je vais apprendre de ça et continuer",
        attachmentScore: "secure",
        nervousSystemScore: 2
      }
    ]
  }
];

export const ATTACHMENT_STYLES = {
  anxious: {
    name: "Attachement Anxieux",
    systemNervousState: "Hyperactivation — toujours en alerte",
    description: "Tu cherches la réassurance constante. Peur de l'abandon, hypervigilance, besoin de validation"
  },
  avoidant: {
    name: "Attachement Évitant",
    systemNervousState: "Sous-activation / Shutdown — tu te fermes",
    description: "Tu fuis l'intimité, tu minimises l'importance des relations, tu restes indépendant jusqu'à la déconnexion"
  },
  disorganized: {
    name: "Attachement Désorganisé",
    systemNervousState: "Dysrégulation extrême — tu passes d'un extrême à l'autre",
    description: "Tu oscilles entre panique d'abandon et fuite. Imprévisible, comportements chaotiques, trauma profond"
  },
  secure: {
    name: "Attachement Sécure",
    systemNervousState: "Régulé — tu peux rester présent",
    description: "Tu es confortable avec l'intimité, tu régules tes émotions, tu fixes des limites claires"
  }
};
