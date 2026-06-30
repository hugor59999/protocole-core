'use client';

import { useState } from 'react';

const QUIZ_QUESTIONS = [
  'Décris en quelques mots ce qui se passe dans ta tête depuis la rupture. Qu\'est-ce qui revient le plus ?',
  'Qu\'est-ce qui fait vraiment mal là-dedans ? Pas le résumé — ce qui te réveille la nuit ou te pèse le matin.',
  'Depuis la rupture, concrètement, qu\'est-ce que tu as fait ? Qu\'est-ce que tu t\'es interdit de faire ?',
  'Ce sentiment de douleur, l\'as-tu déjà vécu dans d\'autres relations ?',
  'Dans tes 3 dernières relations, quel est le pattern exact qui se rejoue ?',
  'Si tu devais nommer ce que tu ressens en un mot ou une phrase, ce serait quoi ?',
  'Ce que tu aimerais vraiment aujourd\'hui au fond de toi, c\'est :',
];

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(7).fill(''));
  const [firstName, setFirstName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [showCollection, setShowCollection] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswerChange = (text: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = text;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!answers[currentQuestion].trim()) {
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

  const handleSubmit = async () => {
    if (!firstName.trim() || !whatsapp.trim()) {
      alert('Prénom et numéro WhatsApp requis');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          whatsapp: whatsapp.trim(),
          answers,
        }),
      });

      if (!res.ok) throw new Error('Erreur');
      setShowConfirmation(true);
    } catch (err) {
      alert('Erreur: ' + (err as any).message);
      setIsLoading(false);
    }
  };

  // Confirmation screen
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
            <div className="text-5xl mb-6">✅</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">C'est tout bon!</h2>
            <p className="text-xl text-gray-300">
              Ton analyse arrive sur WhatsApp<br />
              <span className="text-lg text-gray-400">dans quelques minutes...</span>
            </p>
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
            <p className="text-gray-300 mb-8">avant de recevoir ton analyse</p>

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
                    📱 Tu recevras ton analyse ici
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
                  {isLoading ? 'Envoi...' : 'Valider'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
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
            {QUIZ_QUESTIONS[currentQuestion]}
          </h2>

          <textarea
            value={answers[currentQuestion]}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Réponds en détail..."
            className="w-full h-32 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 resize-none"
          ></textarea>

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
              disabled={!answers[currentQuestion].trim()}
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
