'use client';

import { QuizProfile } from '@/lib/quiz-data';

interface ResultCardProps {
  profile: QuizProfile;
}

export default function ResultCard({ profile }: ResultCardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background accent */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10 md:mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            {profile.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 italic">{profile.subtitle}</p>
        </div>

        {/* Main description */}
        <div className="mb-10 bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/20">
          <div className="space-y-4">
            {profile.description.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-gray-200 leading-relaxed text-sm md:text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* What you need */}
        <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-6 md:p-8 mb-10">
          <h2 className="text-lg font-semibold text-white mb-3">Ce dont tu as besoin</h2>
          <p className="text-gray-200 text-sm md:text-base">{profile.need}</p>
        </div>

        {/* CTA */}
        <div className="text-center mb-8">
          <p className="text-gray-300 mb-6 text-sm md:text-base">
            Ce schéma a une origine précise et il peut se dissoudre. Si tu veux comprendre d'où il
            vient et comment en sortir, je t'ai préparé quelque chose :
          </p>
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full md:w-auto bg-white text-gray-900 px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            👇 {profile.cta}
          </a>
        </div>

        {/* Bottom action */}
        <div className="text-center">
          <a
            href="/quiz"
            className="text-gray-400 hover:text-white font-medium underline text-sm md:text-base"
          >
            Recommencer le quiz
          </a>
        </div>
      </div>
    </div>
  );
}
