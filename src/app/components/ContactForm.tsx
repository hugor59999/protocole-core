'use client';

import { useState } from 'react';

interface ContactFormProps {
  profileId: string;
  onSubmit: (data: { firstName: string; email: string; whatsapp: string }) => void;
  isLoading: boolean;
}

export default function ContactForm({ profileId, onSubmit, isLoading }: ContactFormProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+33');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim()) {
      setError('Ton prénom est requis');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Un email valide est requis');
      return;
    }

    if (!whatsapp.trim()) {
      setError('Ton numéro WhatsApp est requis');
      return;
    }

    const fullWhatsapp = `${countryCode}${whatsapp.replace(/\s/g, '')}`;

    onSubmit({
      firstName: firstName.trim(),
      email: email.trim(),
      whatsapp: fullWhatsapp,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 md:py-12">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Une dernière étape</h2>
          <p className="text-gray-300 mb-8">avant d'accéder à ton diagnostic</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Prénom */}
            <div>
              <label className="block text-white font-medium mb-2">Ton prénom</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ex: Hugo"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white font-medium mb-2">Ton email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: hugo@example.com"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition-colors"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-white font-medium mb-2">Ton numéro WhatsApp</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/50 transition-colors"
                >
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+41">🇨🇭 +41</option>
                  <option value="+32">🇧🇪 +32</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+39">🇮🇹 +39</option>
                  <option value="+34">🇪🇸 +34</option>
                </select>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="6 12 34 56 78"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition-colors"
                />
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-8"
            >
              {isLoading ? 'Chargement...' : 'Voir mon diagnostic →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
