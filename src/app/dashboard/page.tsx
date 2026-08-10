'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Lead {
  id: string;
  firstName: string;
  email: string;
  mobile: string;
  date: string;
  answers: string[];
  diagnosis: string;
  status: string;
}

const SCENARIOS = [
  'Tes relations importantes ont tendance à :',
  'Quand une relation commence à se fragiliser, qu\'est-ce qui se passe en toi en premier ?',
  'Quelqu\'un que tu apprécies ne répond plus pendant 48h. Qu\'est-ce qui se passe vraiment ?',
  'Si tu regardes tes relations significatives, qu\'est-ce qui se répète ?',
  'En repensant à ton enfance, comment décrirais-tu ce que tu as appris sur l\'amour ?',
  'La phrase qui te touche le plus profondément :',
];

export default function DashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      document.cookie = `dashboard_auth=${password}; path=/; max-age=86400`;
      setIsAuthed(true);
      setPassword('');
      fetchLeads();
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/results');
      if (!res.ok) throw new Error('Failed to fetch leads');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      setError((err as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce lead?')) return;

    setDeletingId(id);
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Failed to delete');

      setLeads(leads.filter((l) => l.id !== id));
    } catch (err) {
      alert('Erreur: ' + ((err as any).message || 'Failed to delete'));
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    setIsAuthed(true);
    fetchLeads();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Connexion</h1>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 mb-4 focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500/30 border border-blue-400/50 rounded-lg text-blue-300 hover:bg-blue-500/40 transition font-semibold"
            >
              Connexion
            </button>
          </form>
        </div>
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

  if (selectedLead) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl border border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto w-full">
          <div className="sticky top-0 bg-gray-900/95 border-b border-white/20 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedLead.firstName}</h2>
              <p className="text-blue-400 text-sm mt-1">{selectedLead.status}</p>
            </div>
            <button
              onClick={() => setSelectedLead(null)}
              className="text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Informations</h3>
              <div className="space-y-2">
                <p className="text-gray-400">
                  <span className="text-white font-medium">Email:</span> {selectedLead.email}
                </p>
                <p className="text-gray-400">
                  <span className="text-white font-medium">Mobile:</span> {selectedLead.mobile}
                </p>
                <p className="text-gray-400">
                  <span className="text-white font-medium">Date:</span>{' '}
                  {new Date(selectedLead.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Réponses</h3>
              <div className="space-y-4">
                {SCENARIOS.map((q, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">Q{i + 1}: {q}</p>
                    <p className="text-white">{selectedLead.answers[i]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Diagnostic</h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-white whitespace-pre-wrap">{selectedLead.diagnosis}</p>
              </div>
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
          <p className="text-gray-300">{leads.length} résultats</p>
        </div>

        {leads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Aucun lead pour le moment</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20 bg-white/5">
                    <th className="px-6 py-4 text-left text-white font-semibold">Prénom</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Mobile</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Statut</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-white/10 hover:bg-white/5 transition">
                      <td className="px-6 py-4 text-gray-200">{lead.firstName}</td>
                      <td className="px-6 py-4 text-gray-200 text-sm">{lead.email}</td>
                      <td className="px-6 py-4 text-gray-200 text-sm">{lead.mobile}</td>
                      <td className="px-6 py-4 text-blue-300 text-sm">{lead.status}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(lead.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded text-blue-300 hover:bg-blue-500/30 transition text-sm"
                        >
                          👁️ Voir
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          disabled={deletingId === lead.id}
                          className="px-3 py-1 bg-red-500/20 border border-red-400/30 rounded text-red-300 hover:bg-red-500/30 disabled:opacity-50 transition text-sm"
                        >
                          {deletingId === lead.id ? '...' : '🗑️'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
