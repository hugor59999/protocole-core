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
          <span className="text-sm text-gray-600">Question {question.id} sur 7</span>
          <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gray-900 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.letter}
              onClick={() => onSelectAnswer(option.letter)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === option.letter
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                    selectedAnswer === option.letter
                      ? 'border-gray-900 bg-gray-900'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedAnswer === option.letter && (
                    <span className="text-white text-sm font-bold">✓</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">{option.letter}.</div>
                  <p className="text-gray-700">{option.text}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
