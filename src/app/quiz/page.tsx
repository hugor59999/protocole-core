'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizCard from '@/app/components/QuizCard';
import { QUIZ_METADATA, QUIZ_QUESTIONS } from '@/lib/quiz-data';

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize answers array
    setAnswers(new Array(QUIZ_QUESTIONS.length).fill(null));
  }, []);

  const handleSelectAnswer = (letter: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = letter;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (answers.some((a) => a === null)) {
      alert('Veuillez répondre à toutes les questions');
      return;
    }

    setIsLoading(true);

    // Calculate profile
    const letterCounts = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };

    answers.forEach((answer) => {
      if (answer && answer in letterCounts) {
        letterCounts[answer as keyof typeof letterCounts]++;
      }
    });

    // Determine profile based on majority
    let profile = 'anxious';
    const maxCount = Math.max(
      letterCounts.A,
      letterCounts.B,
      letterCounts.C,
      letterCounts.D
    );

    if (letterCounts.A === maxCount) profile = 'anxious';
    else if (letterCounts.B === maxCount) profile = 'distant';
    else if (letterCounts.C === maxCount) profile = 'disorganized';
    else if (letterCounts.D === maxCount) profile = 'disconnected';

    // Save answers to localStorage
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
    localStorage.setItem('quizProfile', profile);

    // Redirect to results
    router.push(`/quiz/result/${profile}`);
  };

  const isAnswered = answers[currentQuestion] !== null && answers[currentQuestion] !== undefined;
  const isAllAnswered = answers.every((a) => a !== null && a !== undefined);
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  if (answers.length === 0) {
    return null; // Loading
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 md:py-12">
      {/* Background accent */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {currentQuestion === 0 && (
          <div className="w-full max-w-2xl mx-auto px-4 mb-12 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {QUIZ_METADATA.title}
              </h1>
              <p className="text-base md:text-lg text-gray-200 mb-6">{QUIZ_METADATA.subtitle}</p>
              <p className="text-gray-300 italic mb-8 text-sm md:text-base">{QUIZ_METADATA.promise}</p>
              <button
                onClick={() => setCurrentQuestion(1)}
                className="bg-white text-gray-900 px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block w-full md:w-auto"
              >
                Commencer le quiz →
              </button>
            </div>
          </div>
        )}

        {currentQuestion > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
            <QuizCard
              question={QUIZ_QUESTIONS[currentQuestion - 1]}
              selectedAnswer={answers[currentQuestion - 1]}
              onSelectAnswer={handleSelectAnswer}
              progress={progress}
            />
          </div>
        )}

        {/* Navigation */}
        {currentQuestion > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 mt-8 md:mt-12 max-w-2xl mx-auto px-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 1}
              className="w-full md:w-auto px-6 py-2 text-white font-medium rounded-lg border border-white/30 hover:border-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Précédent
            </button>

            <div className="hidden md:flex-1"></div>

            {currentQuestion < QUIZ_QUESTIONS.length ? (
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="w-full md:w-auto px-6 py-2 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Suivant →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isAllAnswered || isLoading}
                className="w-full md:w-auto px-8 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Chargement...' : 'Voir mon diagnostic'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
