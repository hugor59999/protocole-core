'use client';

import { useState, useEffect } from 'react';

interface QuizResult {
  id: number;
  first_name: string;
  email: string;
  whatsapp: string;
  profile: string;
  answers: string;
  diagnosis: string;
  created_at: string;
}

const QUIZ_QUESTIONS = [
  'Tes relations importantes ont tendance à :',
  'Quand une relation commence à se fragiliser, qu\'est-ce qui se passe en toi en premier ?',
  'Quelqu\'un que tu apprécies ne répond plus pendant 48h. Qu\'est-ce qui se passe vraiment ?',
  'Si tu regardes tes relations significatives, qu\'est-ce qui se répète ?',
  'En repensant à ton enfance, comment décrirais-tu ce que tu as appris sur l\'amour ?',
  'La phrase qui te touche le plus profondément :',
  'Au fond, ce que tu cherches vraiment à comprendre c\'est :',
];

const PROFILE_LABELS: Record<string, string> = {
  A: 'L\'ANXIEUX MASQUÉ',
  B: 'LE DISTANT MALGRÉ LUI',
  C: 'LE DÉSORGANISÉ',
  D: 'LE COUPÉ',
};

export default function AdminPage() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce lead?')) return;

    setDeletingId(id);
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Failed to delete');

      setResults(results.filter((r) => r.id !== id));
    } catch (err) {
      alert('Erreur: ' + ((err as any).message || 'Failed to delete'));
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/admin/results');
        if (!res.ok) throw new Error('Failed to fetch results');

        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        setError((err as any).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  // Modal for details
  if (selectedResult) {
    const answers = JSON.parse(selectedResult.answers);
    const profileLabel = PROFILE_LABELS[selectedResult.profile] || selectedResult.profile;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl border border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto w-full">
          <div className="sticky top-0 bg-gray-900/95 border-b border-white/20 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedResult.first_name}</h2>
              <p className="text-blue-400 text-sm mt-1">{profileLabel}</p>
            </div>
            <button
              onClick={() => setSelectedResult(null)}
              className="text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Profil */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Profil détecté</h3>
              <div className="bg-white/5 border border-blue-400/30 rounded-lg p-4">
                <p className="text-blue-300 font-medium">{profileLabel}</p>
              </div>
            </div>

            {/* Réponses */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Réponses du prospect</h3>
              <div className="space-y-4">
                {QUIZ_QUESTIONS.map((q, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">Q{i + 1}: {q}</p>
                    <p className="text-white font-semibold text-lg">{answers[i]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Infos */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
              <p className="text-gray-400">
                <span className="text-white font-medium">WhatsApp:</span> {selectedResult.whatsapp}
              </p>
              <p className="text-gray-400">
                <span className="text-white font-medium">Date:</span>{' '}
                {new Date(selectedResult.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard Quiz</h1>
          <p className="text-gray-300">{results.length} résultats</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20 bg-white/5">
                  <th className="px-6 py-4 text-left text-white font-semibold">Prénom</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Profil</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">WhatsApp</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Détails</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-gray-200">{result.first_name}</td>
                    <td className="px-6 py-4 text-blue-300 text-sm">
                      {PROFILE_LABELS[result.profile] || result.profile}
                    </td>
                    <td className="px-6 py-4 text-gray-200 text-sm">{result.whatsapp}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(result.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedResult(result)}
                        className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded text-blue-300 hover:bg-blue-500/30 transition text-sm"
                      >
                        👁️ Voir
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(result.id)}
                        disabled={deletingId === result.id}
                        className="px-3 py-1 bg-red-500/20 border border-red-400/30 rounded text-red-300 hover:bg-red-500/30 disabled:opacity-50 transition text-sm"
                      >
                        {deletingId === result.id ? '...' : '🗑️'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
