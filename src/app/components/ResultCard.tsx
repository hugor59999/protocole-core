'use client';

import { QuizProfile } from '@/lib/quiz-data';

interface ResultCardProps {
  profile: QuizProfile;
}

export default function ResultCard({ profile }: ResultCardProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{profile.title}</h1>
        <p className="text-xl text-gray-700 italic">{profile.subtitle}</p>
      </div>

      {/* Main description */}
      <div className="mb-10">
        <div className="prose prose-sm max-w-none">
          {profile.description.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-4 text-base">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* What you need */}
      <div className="bg-gray-50 rounded-lg p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Ce dont tu as besoin</h2>
        <p className="text-gray-700">{profile.need}</p>
      </div>

      {/* CTA */}
      <div className="text-center mb-8">
        <p className="text-gray-600 mb-6">
          Ce schéma a une origine précise — et il peut se dissoudre. Si tu veux comprendre d'où il
          vient et comment en sortir, je t'ai préparé quelque chose :
        </p>
        <a
          href="https://calendly.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          👇 {profile.cta}
        </a>
      </div>

      {/* Bottom action */}
      <div className="text-center">
        <a
          href="/quiz"
          className="text-gray-600 hover:text-gray-900 font-medium underline"
        >
          Recommencer le quiz
        </a>
      </div>
    </div>
  );
}
