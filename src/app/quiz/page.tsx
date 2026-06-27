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
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto">
        {currentQuestion === 0 && (
          <div className="w-full max-w-2xl mx-auto px-4 mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{QUIZ_METADATA.title}</h1>
            <p className="text-lg text-gray-700 mb-6">{QUIZ_METADATA.subtitle}</p>
            <p className="text-gray-600 italic mb-8">{QUIZ_METADATA.promise}</p>
            <button
              onClick={() => setCurrentQuestion(1)}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Commencer le quiz →
            </button>
          </div>
        )}

        {currentQuestion > 0 && (
          <QuizCard
            question={QUIZ_QUESTIONS[currentQuestion - 1]}
            selectedAnswer={answers[currentQuestion - 1]}
            onSelectAnswer={handleSelectAnswer}
            progress={progress}
          />
        )}

        {/* Navigation */}
        {currentQuestion > 0 && (
          <div className="flex justify-between items-center gap-4 mt-12 max-w-2xl mx-auto px-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 1}
              className="px-6 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Précédent
            </button>

            <div className="flex-1"></div>

            {currentQuestion < QUIZ_QUESTIONS.length ? (
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Suivant →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isAllAnswered || isLoading}
                className="px-8 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
