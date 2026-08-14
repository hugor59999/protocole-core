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
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        alert('Mot de passe incorrect');
        return;
      }

      setIsAuthed(true);
      setPassword('');
      fetchLeads();
    } catch (err) {
      alert('Erreur de connexion');
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/results', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch leads');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/check-auth', {
          credentials: 'include',
        });
        if (res.ok) {
          setIsAuthed(true);
          fetchLeads();
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(false);
      }
    };

    checkAuth();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard Quiz</h1>
        <p className="text-gray-400 mb-8">Tous les leads sont sauvegardés dans Telegram</p>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <div className="text-center space-y-6">
            <div className="text-6xl">📱</div>
            <h2 className="text-2xl font-bold text-white">Les leads sont dans Telegram</h2>
            <p className="text-gray-300 text-lg">
              Chaque lead soumis via le quiz est automatiquement envoyé à votre Telegram.<br/>
              <strong>Les données persistent pour toujours dans Telegram.</strong>
            </p>

            {leads.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Leads locaux en dev ({leads.length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition"
                    >
                      <p className="font-semibold text-white">{lead.firstName}</p>
                      <p className="text-sm text-gray-400">{lead.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedLead && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl border border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto w-full">
                  <div className="sticky top-0 bg-gray-900/95 border-b border-white/20 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">{selectedLead.firstName}</h2>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
