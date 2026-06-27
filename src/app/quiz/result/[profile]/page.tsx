'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ResultCard from '@/app/components/ResultCard';
import { QUIZ_PROFILES, QuizProfile } from '@/lib/quiz-data';

export default function ResultPage() {
  const params = useParams();
  const profileId = params.profile as string;
  const [profile, setProfile] = useState<QuizProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Map profile ID to profile data
    const profileMap: Record<string, keyof typeof QUIZ_PROFILES> = {
      anxious: 'anxious',
      distant: 'distant',
      disorganized: 'disorganized',
      disconnected: 'disconnected',
    };

    const key = profileMap[profileId];
    if (key && QUIZ_PROFILES[key]) {
      setProfile(QUIZ_PROFILES[key]);
    }
    setIsLoading(false);
  }, [profileId]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profil non trouvé</h1>
          <a
            href="/quiz"
            className="text-gray-600 hover:text-gray-900 font-medium underline"
          >
            Revenir au quiz
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ResultCard profile={profile} />
    </div>
  );
}
