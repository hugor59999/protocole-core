'use client';

import { useState, useEffect } from 'react';

interface QuizResult {
  id: number;
  first_name: string;
  email: string;
  whatsapp: string;
  profile: string;
  created_at: string;
}

export default function AdminPage() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard Admin</h1>
          <p className="text-gray-300">{results.length} résultats</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20 bg-white/5">
                  <th className="px-6 py-4 text-left text-white font-semibold">Prénom</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">WhatsApp</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Profil</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-gray-200">{result.first_name}</td>
                    <td className="px-6 py-4 text-gray-200">{result.email}</td>
                    <td className="px-6 py-4 text-gray-200">{result.whatsapp}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-200 text-sm">
                        {result.profile}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(result.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
// rebuild
