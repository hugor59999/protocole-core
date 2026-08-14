"use client";

import { useState } from "react";
import { SCENARIOS } from "@/lib/scenarios";

type Step =
  | { name: "landing" }
  | { name: "quiz"; index: number }
  | { name: "whatsapp"; answers: string[] }
  | { name: "loading" }
  | { name: "result"; whatsapp: string }
  | { name: "sent" };

export default function Home() {
  const [step, setStep] = useState<Step>({ name: "landing" });
  const [answers, setAnswers] = useState<string[]>(Array(SCENARIOS.length).fill(""));
  const [diagnosis, setDiagnosis] = useState("");
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function runDiagnosis(finalAnswers: string[], whatsapp: string) {
    setStep({ name: "loading" });
    setError("");
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur");
      setDiagnosis(data.diagnosis);
      setStep({ name: "result", whatsapp });
    } catch {
      setError("Une erreur est survenue pendant l'analyse. Réessaie.");
      setStep({ name: "quiz", index: finalAnswers.length - 1 });
    }
  }

  function handleAnswerSubmit(value: string) {
    if (step.name !== "quiz") return;
    const next = [...answers];
    next[step.index] = value;
    setAnswers(next);

    if (step.index < SCENARIOS.length - 1) {
      setStep({ name: "quiz", index: step.index + 1 });
    } else {
      setStep({ name: "whatsapp", answers: next });
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, mobile: mobile || step.name === "result" ? (step as any).whatsapp : "", answers, diagnosis }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur");
      setStep({ name: "sent" });
    } catch {
      setError("Impossible d'enregistrer tes informations. Réessaie.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step.name === "landing") {
    return (
      <Centered>
        <div className="max-w-2xl text-center space-y-10">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              Pourquoi te perds-tu<br />dans tes relations ?
            </h1>
            <p className="text-lg sm:text-xl text-white/70">
              Découvre les schémas inconscients qui sabotent ton pouvoir et ta liberté.
            </p>
          </div>
          <p className="text-sm text-white/50 max-w-md mx-auto">
            Un diagnostic personnalisé basé sur l'analyse de tes patterns relationnels. Gratuit, confidentiellement.
          </p>
          <button
            onClick={() => setStep({ name: "quiz", index: 0 })}
            className="inline-block px-12 py-4 bg-gradient-to-r from-white to-white/90 text-black font-bold tracking-wide rounded-full hover:from-white/95 hover:to-white/85 transition shadow-lg hover:shadow-xl"
          >
            Démarrer le diagnostic →
          </button>
        </div>
      </Centered>
    );
  }

  if (step.name === "quiz") {
    return (
      <QuizStep
        index={step.index}
        total={SCENARIOS.length}
        question={SCENARIOS[step.index]}
        initialValue={answers[step.index]}
        error={error}
        onSubmit={handleAnswerSubmit}
      />
    );
  }

  if (step.name === "whatsapp") {
    return (
      <Centered>
        <div className="max-w-md w-full space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Prêt à découvrir ?
            </h2>
            <p className="text-white/70">
              Partage ton WhatsApp pour recevoir ton diagnostic personnalisé et accéder à des ressources exclusives.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (mobile.trim()) {
                runDiagnosis(step.answers, mobile.trim());
              }
            }}
            className="space-y-4"
          >
            <input
              type="tel"
              required
              autoFocus
              placeholder="Ton numéro WhatsApp (ex: +33612345678)"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 focus:bg-white/10 transition"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-white to-white/90 text-black font-bold tracking-wide rounded-full hover:from-white/95 hover:to-white/85 transition"
            >
              Voir mon diagnostic
            </button>
          </form>
        </div>
      </Centered>
    );
  }

  if (step.name === "loading") {
    return (
      <Centered>
        <div className="text-center space-y-6">
          <div className="mx-auto h-10 w-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-lg text-white/70 tracking-wide">Analyse en cours...</p>
        </div>
      </Centered>
    );
  }

  if (step.name === "result") {
    const calendlyUrl = "https://calendly.com/hugo-rf/appel-decouverte-core";
    return (
      <Centered>
        <div className="max-w-3xl w-full space-y-12 py-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Ton diagnostic
              </h2>
              <p className="text-white/60">
                Analyse personnalisée basée sur tes réponses
              </p>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8 sm:p-10 text-white/90 leading-relaxed whitespace-pre-wrap text-base sm:text-lg space-y-4">
              {diagnosis.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8 text-center space-y-6">
            <div className="space-y-2">
              <p className="text-white font-semibold text-lg">
                Prêt à passer à l'action ?
              </p>
              <p className="text-white/70">
                Réserve un appel avec Hugo pour transformer ces insights en changements concrets.
              </p>
            </div>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold tracking-wide rounded-full hover:from-blue-600 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
            >
              Réserver un appel gratuit →
            </a>
            <p className="text-white/50 text-sm">
              Appel découverte de 30 min. Aucun engagement.
            </p>
          </div>

          <div className="border-t border-white/10 pt-12 space-y-6">
            <div className="space-y-2">
              <p className="text-white/60 text-sm">
                Tu veux aussi recevoir ce diagnostic par email ? Entre tes infos.
              </p>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4 max-w-md">
              <input
                type="text"
                required
                placeholder="Ton prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 focus:bg-white/10 transition"
              />
              <input
                type="email"
                required
                placeholder="Ton email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 focus:bg-white/10 transition"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-8 py-3 bg-white/10 text-white font-medium tracking-wide rounded-full border border-white/20 hover:bg-white/20 transition disabled:opacity-50"
              >
                {submitting ? "Envoi..." : "Recevoir par email"}
              </button>
            </form>
          </div>
        </div>
      </Centered>
    );
  }

  // sent
  return (
    <Centered>
      <div className="max-w-md text-center space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            C'est en route. ✓
          </h2>
          <p className="text-white/70 text-lg">
            Ton diagnostic complet est en chemin vers ton email.
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-6 space-y-4">
          <p className="text-white/80">
            Prêt à transformer ce que tu viens de découvrir ?
          </p>
          <a
            href="https://calendly.com/hugo-rf/appel-decouverte-core"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold tracking-wide rounded-full hover:from-blue-600 hover:to-purple-700 transition"
          >
            Réserver un appel avec Hugo
          </a>
        </div>
        <p className="text-white/50 text-sm">
          Appel gratuit de 30 min. Aucun engagement. Juste un conversation honnête.
        </p>
      </div>
    </Centered>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 flex items-center justify-center px-6">
      {children}
    </main>
  );
}

function QuizStep({
  index,
  total,
  question,
  initialValue,
  error,
  onSubmit,
}: {
  index: number;
  total: number;
  question: string;
  initialValue: string;
  error: string;
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const progress = ((index + 1) / total) * 100;

  return (
    <main className="flex-1 flex flex-col px-6 py-10">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
        <div className="mb-12 space-y-3">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-white to-white/70 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-white/40">
            Question {index + 1} sur {total}
          </p>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug mb-10">
          {question}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) onSubmit(value.trim());
          }}
          className="flex-1 flex flex-col"
        >
          <textarea
            autoFocus
            required
            rows={6}
            placeholder="Sois honnête. Qu'est-ce qui se passe réellement en toi dans cette situation ?"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 focus:bg-white/10 transition resize-none"
          />
          {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
          <button
            type="submit"
            className="mt-8 self-start px-8 py-3 bg-gradient-to-r from-white to-white/90 text-black font-bold tracking-wide rounded-full hover:from-white/95 hover:to-white/85 transition"
          >
            {index === total - 1 ? "Voir mon diagnostic" : "Suivant →"}
          </button>
        </form>
      </div>
    </main>
  );
}
