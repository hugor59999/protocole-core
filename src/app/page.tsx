"use client";

import { useState } from "react";

interface QuizAnswer {
  question: number;
  answer: string;
}

type Step = "landing" | "quiz" | "whatsapp" | "loading" | "sent";

const QUESTIONS = [
  {
    id: 1,
    text: "Elle met 3h à répondre. Qu'est-ce qui se passe en toi ?",
    options: [
      "Je relis mon dernier message pour voir ce que j'ai dit de travers",
      "Je continue ma journée, elle est sûrement occupée",
      "Je lui envoie un message pour vérifier que tout va bien",
      "Je pose mon téléphone et je fais comme si ça ne me touchait pas"
    ]
  },
  {
    id: 2,
    text: "Tu rencontres quelqu'un qui correspond à tout ce que tu cherches:",
    options: [
      "Je commence à trop y tenir avant même que la relation soit réelle",
      "Je m'investis naturellement sans perdre mon ancrage",
      "J'ai besoin de savoir rapidement si elle ressent la même chose",
      "Je garde mes distances malgré l'attraction, trop d'enjeu"
    ]
  },
  {
    id: 3,
    text: "Après une rupture ou un ghosting, tu fais:",
    options: [
      "Je rejoue les scènes en cherchant ce que j'aurais pu faire différemment",
      "Je prends le temps de traverser ça, puis je passe à autre chose",
      "Je reprends contact pour avoir une explication",
      "Je passe rapidement à autre chose pour ne pas ressentir"
    ]
  },
  {
    id: 4,
    text: "Quand tu prends du temps pour toi librement, tu ressens:",
    options: [
      "De la culpabilité: j'aurais dû être plus productif ou présent",
      "Rien, me reposer fait partie de ma vie",
      "De l'anxiété: les autres vont penser que je ne m'investis pas",
      "Du vide, sans accomplissement je ne sais pas trop qui je suis"
    ]
  },
  {
    id: 5,
    text: "Pour toi, être aimé c'est:",
    options: [
      "Être accepté pour qui tu es, sans avoir à le mériter",
      "Être reconnu pour ce que tu apportes et accomplis",
      "Quelque chose d'incertain qui peut disparaître à tout moment",
      "Quelque chose que tu mérites quand tu te comportes bien"
    ]
  }
];

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [openAnswer, setOpenAnswer] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelectAnswer = (index: number) => {
    setSelectedIndex(index);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;

    const newAnswers = [
      ...answers,
      {
        question: QUESTIONS[currentQuestion].id,
        answer: QUESTIONS[currentQuestion].options[selectedIndex]
      }
    ];
    setAnswers(newAnswers);
    setSelectedIndex(null);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep("quiz");
    }
  };

  const handleSubmitOpen = async () => {
    if (!openAnswer.trim()) return;
    setStep("whatsapp");
  };

  const handleSendWhatsApp = async () => {
    if (!whatsapp.trim()) {
      setError("Le numéro WhatsApp est obligatoire pour recevoir ton diagnostic");
      return;
    }

    setStep("loading");
    setError("");

    try {
      // Generate diagnosis
      const diagnosis = generateDiagnosis(answers, openAnswer);

      // Send via WhatsApp API
      const response = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp: whatsapp.trim(),
          diagnosis: diagnosis
        })
      });

      if (!response.ok) throw new Error("Failed to send WhatsApp");

      setStep("sent");
    } catch (err) {
      console.error("Error:", err);
      setError("Erreur lors de l'envoi du diagnostic. Réessaie.");
      setStep("whatsapp");
    }
  };

  const generateDiagnosis = (quizAnswers: QuizAnswer[], openAnswer: string): string => {
    const answerTexts = quizAnswers.map(a => a.answer);

    const anxious = (
      (answerTexts[0]?.includes("relis") ? 1 : 0) +
      (answerTexts[1]?.includes("trop y tenir") ? 1 : 0) +
      (answerTexts[2]?.includes("reprends contact") ? 1 : 0) +
      (answerTexts[3]?.includes("culpabilité") ? 1 : 0) +
      (answerTexts[4]?.includes("incertain") ? 1 : 0)
    );

    const avoidant = (
      (answerTexts[0]?.includes("pose mon téléphone") ? 1 : 0) +
      (answerTexts[1]?.includes("distances") ? 1 : 0) +
      (answerTexts[2]?.includes("rapidement") ? 1 : 0) +
      (answerTexts[3]?.includes("vide") ? 1 : 0) +
      (answerTexts[4]?.includes("accomplissement") ? 1 : 0)
    );

    const secure = (
      (answerTexts[0]?.includes("continue") ? 1 : 0) +
      (answerTexts[1]?.includes("naturellement") ? 1 : 0) +
      (answerTexts[2]?.includes("prends le temps") ? 1 : 0) +
      (answerTexts[3]?.includes("Rien") ? 1 : 0) +
      (answerTexts[4]?.includes("accepté") ? 1 : 0)
    );

    const preoccupied = (
      (answerTexts[0]?.includes("envoie un message") ? 1 : 0) +
      (answerTexts[1]?.includes("rapidement") ? 1 : 0) +
      (answerTexts[2]?.includes("rejoue") ? 1 : 0) +
      (answerTexts[3]?.includes("anxiété") ? 1 : 0) +
      (answerTexts[4]?.includes("mérite") ? 1 : 0)
    );

    let attachmentStyle = "Secure";
    let mask = "L'Adaptateur";
    let explanation = "";

    if (anxious >= 3) {
      attachmentStyle = "Anxious";
      mask = "L'Anxieux";
      explanation = "Tu cherches constamment la validation et la réassurance. Tu interprètes chaque silence comme un rejet potentiel, et tu t'adaptes excessivement pour maintenir la connexion.";
    } else if (avoidant >= 3) {
      attachmentStyle = "Avoidant";
      mask = "L'Indépendant";
      explanation = "Tu maintiens une distance émotionnelle pour te protéger. Tu valorises ton autonomie au-dessus de la connexion, et tu repousses l'intimité dès qu'elle devient trop intense.";
    } else if (preoccupied >= 3) {
      attachmentStyle = "Preoccupied";
      mask = "L'Hypervigilant";
      explanation = "Tu es constamment préoccupé par l'état de ta relation. Tu cherches des signes de problèmes et tu interviens rapidement, parfois de façon maladroite, pour résoudre une situation.";
    } else {
      attachmentStyle = "Secure";
      mask = "L'Équilibré";
      explanation = "Tu as une relation saine avec la solitude et l'intimité. Tu peux te reposer sans culpabilité et tu acceptes le rythme naturel des relations.";
    }

    return `DIAGNOSTIC COMPLET

Ton style d'attachement: ${attachmentStyle}
Le masque que tu portes: ${mask}

${explanation}

Ce que tu veux changer:
"${openAnswer}"

---

Ce qui s'apprend peut se désapprendre.
Sors du pilote automatique.`;
  };

  // Landing page
  if (step === "landing") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#1C1A16" }}>
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-serif font-bold" style={{ color: "#F5EFE4" }}>
              Comprends ton attachement
            </h1>
            <p className="text-lg" style={{ color: "#F5EFE4" }}>
              Découvre le masque que tu portes en relation et ce qui se cache vraiment en toi.
            </p>
          </div>
          <button
            onClick={() => setStep("quiz")}
            className="w-full py-4 px-8 rounded-lg font-semibold transition hover:opacity-90"
            style={{ backgroundColor: "#C8A97A", color: "#1C1A16" }}
          >
            Démarrer le quiz →
          </button>
        </div>
      </div>
    );
  }

  // Quiz page (questions 1-5)
  if (step === "quiz" && currentQuestion < QUESTIONS.length) {
    const question = QUESTIONS[currentQuestion];
    const progress = ((currentQuestion + 1) / (QUESTIONS.length + 1)) * 100;

    return (
      <div className="min-h-screen flex flex-col px-6 py-8" style={{ backgroundColor: "#1C1A16" }}>
        <div className="max-w-md w-full mx-auto flex-1 flex flex-col">
          <div className="mb-12 space-y-3">
            <div className="h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: "#3D5247" }}>
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: "#C8A97A" }}
              />
            </div>
            <p className="text-sm" style={{ color: "#F5EFE4" }}>
              Question {currentQuestion + 1} sur {QUESTIONS.length + 1}
            </p>
          </div>

          <h2 className="text-2xl font-serif font-bold mb-10" style={{ color: "#F5EFE4" }}>
            {question.text}
          </h2>

          <div className="space-y-3 flex-1">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className="w-full p-4 rounded-lg text-left transition"
                style={{
                  backgroundColor: selectedIndex === index ? "#C8A97A" : "#3D5247",
                  color: selectedIndex === index ? "#1C1A16" : "#F5EFE4",
                  border: `2px solid ${selectedIndex === index ? "#C8A97A" : "transparent"}`
                }}
              >
                <p className="font-semibold">{String.fromCharCode(65 + index)}.</p>
                <p>{option}</p>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selectedIndex === null}
            className="mt-8 px-8 py-4 rounded-lg font-semibold transition disabled:opacity-50"
            style={{
              backgroundColor: selectedIndex !== null ? "#C8A97A" : "#3D5247",
              color: "#1C1A16"
            }}
          >
            {currentQuestion === QUESTIONS.length - 1 ? "Suivant (Question ouverte)" : "Suivant →"}
          </button>
        </div>
      </div>
    );
  }

  // Open question (question 6)
  if (step === "quiz" && currentQuestion >= QUESTIONS.length) {
    const progress = ((QUESTIONS.length + 1) / (QUESTIONS.length + 1)) * 100;

    return (
      <div className="min-h-screen flex flex-col px-6 py-8" style={{ backgroundColor: "#1C1A16" }}>
        <div className="max-w-md w-full mx-auto flex-1 flex flex-col">
          <div className="mb-12 space-y-3">
            <div className="h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: "#3D5247" }}>
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: "#C8A97A" }}
              />
            </div>
            <p className="text-sm" style={{ color: "#F5EFE4" }}>
              Question {QUESTIONS.length + 1} sur {QUESTIONS.length + 1}
            </p>
          </div>

          <h2 className="text-2xl font-serif font-bold mb-8" style={{ color: "#F5EFE4" }}>
            Qu'est-ce que tu veux vraiment changer dans tes relations ?
          </h2>

          <textarea
            value={openAnswer}
            onChange={(e) => setOpenAnswer(e.target.value)}
            placeholder="Écris librement..."
            className="flex-1 p-4 rounded-lg resize-none focus:outline-none"
            style={{
              backgroundColor: "#3D5247",
              color: "#F5EFE4",
              borderColor: "#C8A97A"
            }}
          />

          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

          <button
            onClick={handleSubmitOpen}
            disabled={!openAnswer.trim()}
            className="mt-8 px-8 py-4 rounded-lg font-semibold transition disabled:opacity-50"
            style={{
              backgroundColor: openAnswer.trim() ? "#C8A97A" : "#3D5247",
              color: "#1C1A16"
            }}
          >
            Continuer →
          </button>
        </div>
      </div>
    );
  }

  // WhatsApp collection page
  if (step === "whatsapp") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#1C1A16" }}>
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-serif font-bold" style={{ color: "#F5EFE4" }}>
              Reçois ton diagnostic par WhatsApp
            </h2>
            <p style={{ color: "#F5EFE4" }}>
              Entre ton numéro WhatsApp pour recevoir ton diagnostic complet. Assure-toi de bien entrer le bon numéro sinon tu ne recevras rien.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="tel"
              placeholder="+33612345678"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full p-4 rounded-lg focus:outline-none"
              style={{
                backgroundColor: "#3D5247",
                color: "#F5EFE4",
                borderColor: "#C8A97A"
              }}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleSendWhatsApp}
              disabled={!whatsapp.trim()}
              className="w-full py-4 px-8 rounded-lg font-semibold transition hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: whatsapp.trim() ? "#C8A97A" : "#3D5247",
                color: "#1C1A16"
              }}
            >
              Recevoir mon diagnostic →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading page
  if (step === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1C1A16" }}>
        <div className="text-center space-y-6">
          <div
            className="mx-auto h-12 w-12 border-4 rounded-full animate-spin"
            style={{ borderColor: "#3D5247", borderTopColor: "#C8A97A" }}
          />
          <p style={{ color: "#F5EFE4" }} className="text-lg">
            Envoi en cours...
          </p>
        </div>
      </div>
    );
  }

  // Sent page
  if (step === "sent") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#1C1A16" }}>
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-serif font-bold" style={{ color: "#F5EFE4" }}>
              C'est en route ✓
            </h2>
            <p style={{ color: "#F5EFE4" }}>
              Ton diagnostic complet arrive sur WhatsApp dans quelques instants.
            </p>
          </div>

          <div className="text-center space-y-4">
            <a
              href="https://calendly.com/hugo-rf/session-de-reconstruction-clone"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 rounded-lg font-semibold transition"
              style={{ backgroundColor: "#C8A97A", color: "#1C1A16" }}
            >
              Réserver un appel →
            </a>
            <p style={{ color: "#F5EFE4" }} className="text-sm">
              Appel de reconstruction de 60 min
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
