"use client";

import { useState } from "react";
import { SCENARIOS } from "@/lib/scenarios";

type Step =
  | { name: "landing" }
  | { name: "quiz"; index: number }
  | { name: "loading" }
  | { name: "result" }
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

  async function runDiagnosis(finalAnswers: string[]) {
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
      setStep({ name: "result" });
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
      runDiagnosis(next);
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
        body: JSON.stringify({ firstName, email, mobile, answers, diagnosis }),
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
        <div className="max-w-xl text-center space-y-8">
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-tight">
            Pourquoi te perds-tu dans tes relations ?{" "}
            <span className="text-white/70">
              Découvre les schémas inconscients qui sabotent ton pouvoir.
            </span>
          </h1>
          <button
            onClick={() => setStep({ name: "quiz", index: 0 })}
            className="inline-block px-10 py-4 bg-white text-black font-medium tracking-wide rounded-full hover:bg-white/90 transition"
          >
            Commencer
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
    return (
      <Centered>
        <div className="max-w-2xl w-full space-y-12 py-16">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Ton diagnostic
            </h2>
            <div className="text-white/80 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
              {diagnosis}
            </div>
          </div>

          <div className="border-t border-white/10 pt-10 space-y-6">
            <p className="text-white/60 text-sm">
              Reçois ce diagnostic par email, gardé précieusement.
            </p>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Ton prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition"
              />
              <input
                type="email"
                required
                placeholder="Ton email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition"
              />
              <input
                type="tel"
                placeholder="Ton mobile (optionnel)"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-8 py-4 bg-white text-black font-medium tracking-wide rounded-full hover:bg-white/90 transition disabled:opacity-50"
              >
                {submitting ? "Envoi..." : "Recevoir mon diagnostic par email"}
              </button>
            </form>
          </div>
        </div>
      </Centered>
    );
  }

  // sent
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;
  return (
    <Centered>
      <div className="max-w-md text-center space-y-8">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          C&apos;est envoyé.
        </h2>
        <p className="text-white/70">
          Va checker ta boîte mail, ton diagnostic complet t&apos;y attend.
        </p>
        <p className="text-white/50 text-sm">
          Si tu veux aller plus loin et transformer ce que tu viens de découvrir, réserve un appel avec Hugo.
        </p>
        {calendlyUrl && (
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-white text-black font-medium tracking-wide rounded-full hover:bg-white/90 transition"
          >
            Réserver un appel avec Hugo
          </a>
        )}
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
  const [value, setValue] = useState(initialValue);
  const progress = ((index + 1) / total) * 100;

  return (
    <main className="flex-1 flex flex-col px-6 py-10">
      <div className="max-w-xl w-full mx-auto flex-1 flex flex-col">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-12">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-white/40 mb-4">
          {index + 1} / {total}
        </p>

        <h2 className="text-xl sm:text-2xl font-medium tracking-tight leading-snug mb-8">
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
            rows={5}
            placeholder="Décris ta réaction en 2-3 phrases..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition resize-none"
          />
          {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
          <button
            type="submit"
            className="mt-6 self-start px-8 py-3 bg-white text-black font-medium tracking-wide rounded-full hover:bg-white/90 transition"
          >
            {index === total - 1 ? "Terminer" : "Suivant"}
          </button>
        </form>
      </div>
    </main>
  );
}
