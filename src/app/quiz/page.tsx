'use client';

import { useState } from 'react';

const QUIZ_QUESTIONS = [
  {
    question: 'Tes relations importantes ont tendance à :',
    options: {
      A: 'Commencer fort et s\'effondrer progressivement sans que tu comprennes vraiment pourquoi',
      B: 'Ne jamais vraiment démarrer — tu restes en surface même quand tu veux aller plus loin',
      C: 'Alterner entre rapprochement intense et envie soudaine de fuir',
      D: 'Te faire sentir que tu donnes beaucoup plus que l\'autre, sans savoir pourquoi tu acceptes ça',
    },
  },
  {
    question: 'Quand une relation commence à se fragiliser, qu\'est-ce qui se passe en toi en premier ?',
    options: {
      A: 'Une alerte intérieure — tu surveilles les signaux, tu analyses chaque message',
      B: 'Un retrait progressif — tu t\'éloignes avant que l\'autre puisse partir en premier',
      C: 'Une confusion — une partie de toi veut se rapprocher, une autre veut fuir',
      D: 'Un vide — tu te déconnectes de ce que tu ressens, tu continues comme si de rien n\'était',
    },
  },
  {
    question: 'Quelqu\'un que tu apprécies ne répond plus pendant 48h. Qu\'est-ce qui se passe vraiment ?',
    options: {
      A: 'Tu analyses en boucle — les derniers messages, son comportement des jours précédents',
      B: 'Tu te dis que c\'est fini et tu commences à t\'en détacher, même si rien n\'est confirmé',
      C: 'Tu hésites entre envoyer un message et couper le contact toi-même en premier',
      D: 'Tu ressens à peine quelque chose — tu as appris à couper le signal avant qu\'il arrive',
    },
  },
  {
    question: 'Si tu regardes tes relations significatives, qu\'est-ce qui se répète ?',
    options: {
      A: 'Tu t\'attaches à des personnes émotionnellement peu disponibles ou distantes',
      B: 'Tu commences fort puis tu te retrouves seul — tu t\'es éloigné sans vraiment savoir pourquoi',
      C: 'Tu t\'approches, tu te retires, tu reviens — tu oscilles entre envie de fusionner et envie de fuir',
      D: 'Tu t\'investis à fond, tu te fais avoir, et ça finit toujours de la même façon',
    },
  },
  {
    question: 'En repensant à ton enfance, comment décrirais-tu ce que tu as appris sur l\'amour ?',
    options: {
      A: 'Il fallait mériter l\'attention — être sage, performant, ou discret pour être aimé',
      B: 'L\'affection n\'était pas très présente — tu as appris à te débrouiller seul émotionnellement',
      C: 'C\'était imprévisible — parfois présent et chaleureux, parfois distant ou effrayant',
      D: 'Tu ne saurais pas vraiment dire — c\'est flou, tu n\'y as jamais trop repensé',
    },
  },
  {
    question: 'La phrase qui te touche le plus profondément :',
    options: {
      A: '"J\'ai peur de ne pas être suffisant pour qu\'on reste."',
      B: '"Je sais pas vraiment ce que je ressens — j\'ai du mal à y accéder."',
      C: '"Je veux me rapprocher et en même temps quelque chose me pousse à fuir."',
      D: '"Je m\'oublie dès que je suis en relation."',
    },
  },
  {
    question: 'Au fond, ce que tu cherches vraiment à comprendre c\'est :',
    options: {
      A: 'Pourquoi ça finit toujours pareil, malgré tes efforts',
      B: 'Pourquoi tu gardes tout le monde à distance même quand tu veux le contraire',
      C: 'Pourquoi tu sabotes les relations qui pourraient vraiment marcher',
      D: 'Pourquoi tu ressens si peu alors que tu veux ressentir plus',
    },
  },
];

const PROFILES: Record<string, { title: string; subtitle: string; description: string }> = {
  A: {
    title: 'L\'ANXIEUX MASQUÉ',
    subtitle: '"Tu paniques en silence depuis des années."',
    description: `Tu as appris à paraître calme. Mais en intérieur, dès qu'une relation compte vraiment, ton système nerveux s'emballe. Tu surveilles les signaux, tu analyses les messages, tu fais des scénarios. Et tu caches tout ça parce qu'on t'a appris que montrer l'angoisse repousse.

Le résultat : tu es épuisant pour toi-même. Tu passes plus de temps à gérer ton anxiété intérieure qu'à vivre vraiment la relation. Et dès que l'autre se retire un peu, la spirale se déclenche — sur-analyse, sur-investissement, perte de toi-même.

Ce qui se passe vraiment : une peur d'abandon installée très tôt qui te fait vivre chaque relation comme si la fin était déjà là, imminente.

**Ce dont tu as besoin :** comprendre d'où vient cette alarme, apprendre à la traverser sans la fuir — et arrêter de te trahir pour garder l'autre.`,
  },
  B: {
    title: 'LE DISTANT MALGRÉ LUI',
    subtitle: '"Tu veux te connecter, mais quelque chose en toi résiste."',
    description: `Tu gardes une distance. Pas par manque d'envie — mais parce que s'approcher vraiment semble dangereux. Tu t'éloignes avant que l'autre puisse partir. Tu gères seul. Tu ne montres pas ce que tu ressens, parfois parce que tu n'y accèdes pas toi-même.

Le résultat : des relations qui restent en surface. Des gens qui sentent qu'il y a quelque chose derrière ta façade mais n'arrivent jamais à l'atteindre.

Ce qui se passe vraiment : tu t'es construit une armure très tôt, probablement parce que s'ouvrir a été douloureux ou inutile à un moment clé.

**Ce dont tu as besoin :** retrouver l'accès à ce que tu ressens — et t'autoriser à exister pleinement dans une relation sans avoir à tout contrôler.`,
  },
  C: {
    title: 'LE DÉSORGANISÉ',
    subtitle: '"Tu veux la relation. Et tu la sabotes en même temps."',
    description: `Tu t'approches, puis tu fuis. Tu t'investis fort, puis quelque chose te pousse à te retirer — sans que tu comprennes vraiment pourquoi. Tu peux passer de l'attachement intense à la froideur totale en quelques jours.

Le résultat : des relations qui partent dans tous les sens. Des proches qui ne savent pas où ils en sont avec toi — parce que toi non plus tu ne le sais pas vraiment.

Ce qui se passe vraiment : deux besoins contradictoires actifs en même temps. Le besoin de connexion — et le besoin de sécurité qui associe la proximité à un danger.

**Ce dont tu as besoin :** comprendre les deux parts qui se battent en toi — et apprendre à créer de la sécurité intérieure pour ne plus avoir à fuir ce que tu désires.`,
  },
  D: {
    title: 'LE COUPÉ',
    subtitle: '"Tu ressens peu. Mais tu veux ressentir plus."',
    description: `Face aux situations relationnelles, tu as du mal à identifier ce qui se passe en toi. Pas par indifférence — par déconnexion. À un moment, ton système a appris à couper le signal émotionnel avant même qu'il arrive.

Le résultat : tu fonctionnes, tu avances, tu n'as pas l'air d'être touché. Mais il y a un vide. Une impression de vivre tes relations de l'extérieur, comme spectateur.

Ce qui se passe vraiment : une dissociation émotionnelle construite très tôt pour survivre dans un environnement où ressentir était dangereux ou inutile.

**Ce dont tu as besoin :** retrouver le chemin vers toi-même — pas en forçant les émotions, mais en créant un espace sécurisé pour les laisser revenir.`,
  },
};

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(7).fill(''));
  const [firstName, setFirstName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [showCollection, setShowCollection] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [profile, setProfile] = useState<keyof typeof PROFILES | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswerSelect = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      alert('Veuillez répondre avant de continuer');
      return;
    }
    if (currentQuestion < 6) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowCollection(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateProfile = () => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    answers.forEach((answer) => {
      if (answer in counts) counts[answer as keyof typeof counts]++;
    });

    const max = Math.max(counts.A, counts.B, counts.C, counts.D);
    for (const [key, value] of Object.entries(counts)) {
      if (value === max) return key as keyof typeof PROFILES;
    }
    return 'A';
  };

  const handleSubmit = async () => {
    if (!firstName.trim() || !whatsapp.trim()) {
      alert('Prénom et numéro WhatsApp requis');
      return;
    }

    setIsLoading(true);
    const detectedProfile = calculateProfile();
    setProfile(detectedProfile);

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          whatsapp: whatsapp.trim(),
          answers,
          profile: detectedProfile,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      setShowResult(true);
    } catch (err) {
      alert('Erreur: ' + (err as any).message);
      setIsLoading(false);
    }
  };

  // Result screen with profile
  if (showResult && profile) {
    const profileData = PROFILES[profile];
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12">
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">{profileData.title}</h2>
              <p className="text-xl text-gray-300 italic mb-8">{profileData.subtitle}</p>
            </div>

            <div className="bg-white/5 border border-blue-400/30 rounded-lg p-6 md:p-8 mb-8">
              <p className="text-white leading-relaxed whitespace-pre-wrap font-light">
                {profileData.description}
              </p>
            </div>

            <div className="mb-8">
              <a
                href="https://calendly.com/hugo-rf/appel-decouverte-core?utm_source=quiz"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg text-center transition transform hover:scale-105"
              >
                📅 Prendre un rendez-vous pour explorer
              </a>
              <p className="text-center text-gray-400 text-sm mt-3">
                Un appel de découverte pour comprendre ton profil et les prochaines étapes
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
              <p className="text-gray-400">
                <span className="text-white font-medium">Prénom:</span> {firstName}
              </p>
              <p className="text-gray-400">
                <span className="text-white font-medium">WhatsApp:</span> {whatsapp}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Collection screen
  if (showCollection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 md:py-12">
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Une dernière étape</h2>
            <p className="text-gray-300 mb-8">avant de voir ton profil</p>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Ton prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ex: Hugo"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Ton numéro WhatsApp
                  <span className="block text-sm text-gray-400 font-normal mt-1">
                    📱 Pour te recontacter si besoin
                  </span>
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCollection(false);
                    setCurrentQuestion(6);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
                >
                  ← Retour
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  {isLoading ? 'Chargement...' : 'Voir mon profil'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
  const currentQ = QUIZ_QUESTIONS[currentQuestion];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 md:py-12">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Question {currentQuestion + 1} sur 7</span>
            <span className="text-gray-400">
              {Math.round(((currentQuestion + 1) / 7) * 100)}%
            </span>
          </div>
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
              style={{ width: `${((currentQuestion + 1) / 7) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {Object.entries(currentQ.options).map(([letter, text]) => (
              <button
                key={letter}
                onClick={() => handleAnswerSelect(letter)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  answers[currentQuestion] === letter
                    ? 'bg-blue-500/20 border-blue-400/50 text-white'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                }`}
              >
                <span className="font-semibold">{letter}.</span> {text}
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 disabled:opacity-30 transition"
            >
              ← Précédent
            </button>
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion]}
              className="flex-1 px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Suivant →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
