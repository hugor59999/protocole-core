'use client';

import { QuizQuestion } from '@/lib/quiz-data';

interface QuizCardProps {
  question: QuizQuestion;
  selectedAnswer: string | null;
  onSelectAnswer: (letter: string) => void;
  progress: number;
}

export default function QuizCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  progress,
}: QuizCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Question {question.id} sur 7</span>
          <span className="text-sm font-medium text-white">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-6 leading-snug">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.letter}
              onClick={() => onSelectAnswer(option.letter)}
              className={`w-full text-left p-4 md:p-5 rounded-lg border-2 transition-all ${
                selectedAnswer === option.letter
                  ? 'border-white bg-white/20'
                  : 'border-white/20 hover:border-white/40 bg-white/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-all ${
                    selectedAnswer === option.letter
                      ? 'border-white bg-white'
                      : 'border-gray-400'
                  }`}
                >
                  {selectedAnswer === option.letter && (
                    <span className="text-gray-900 text-sm font-bold">✓</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white mb-1">{option.letter}.</div>
                  <p className="text-gray-200 text-sm md:text-base">{option.text}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
