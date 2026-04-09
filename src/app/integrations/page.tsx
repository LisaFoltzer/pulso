"use client";

import { useState } from "react";

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  connected: boolean;
  stats?: string;
};

const initialIntegrations: Integration[] = [
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Emails envoyés et reçus, calendrier, invitations meetings",
    icon: <OutlookIcon />,
    color: "#0078D4",
    connected: false,
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Messages dans les canaux, chats privés, meetings",
    icon: <TeamsIcon />,
    color: "#6264A7",
    connected: false,
  },
  {
    id: "aircall",
    name: "Aircall",
    description: "Appels entrants et sortants, durées, transcriptions",
    icon: <AircallIcon />,
    color: "#00B388",
    connected: false,
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState<{
    step: string;
    percent: number;
    details: string;
  } | null>(null);
  const [results, setResults] = useState<null | {
    events: number;
    filtered: number;
    processes: number;
  }>(null);

  const connectedCount = integrations.filter((i) => i.connected).length;

  function handleConnect(id: string) {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              connected: true,
              stats:
                id === "outlook"
                  ? "1,247 emails (30 jours)"
                  : id === "teams"
                    ? "832 messages (30 jours)"
                    : "156 appels (30 jours)",
            }
          : i
      )
    );
  }

  function handleDisconnect(id: string) {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: false, stats: undefined } : i))
    );
  }

  async function handleAnalyze() {
    setAnalyzing(true);
    setResults(null);

    const steps = [
      { step: "Récupération des données", percent: 15, details: "Outlook: 1,247 emails · Teams: 832 messages · Aircall: 156 appels", delay: 1500 },
      { step: "Normalisation", percent: 30, details: "2,235 événements normalisés au format unifié", delay: 1200 },
      { step: "Filtrage IA (Haiku)", percent: 50, details: "Élimination du bruit : newsletters, spam, notifications auto...", delay: 2000 },
      { step: "Extraction sémantique (Sonnet)", percent: 75, details: "Analyse du contenu : demandes, validations, escalades, décisions...", delay: 2500 },
      { step: "Détection des process", percent: 90, details: "Regroupement des interactions en process métier récurrents...", delay: 2000 },
      { step: "Génération des maps", percent: 100, details: "Création des nœuds, arêtes et calcul des scores de santé", delay: 1000 },
    ];

    for (const s of steps) {
      setProgress({ step: s.step, percent: s.percent, details: s.details });
      await new Promise((r) => setTimeout(r, s.delay));
    }

    setProgress(null);
    setResults({ events: 2235, filtered: 487, processes: 5 });
    setAnalyzing(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Integration cards */}
      <div className="space-y-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="rounded-xl px-6 py-5 flex items-center gap-5"
            style={{
              backgroundColor: "#FFFFFF",
              border: integration.connected
                ? `2px solid ${integration.color}`
                : "1px solid #E2E8F0",
            }}
          >
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: integration.color + "12" }}
            >
              {integration.icon}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold" style={{ color: "#0F172A" }}>
                  {integration.name}
                </h3>
                {integration.connected && (
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
                    style={{ color: "#22C55E", backgroundColor: "rgba(34,197,94,0.1)" }}
                  >
                    Connecté
                  </span>
                )}
              </div>
              <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                {integration.description}
              </p>
              {integration.stats && (
                <p className="text-xs font-medium mt-1" style={{ color: integration.color }}>
                  {integration.stats}
                </p>
              )}
            </div>

            {/* Action */}
            {integration.connected ? (
              <button
                onClick={() => handleDisconnect(integration.id)}
                className="text-xs font-medium px-4 py-2 rounded-lg transition-colors shrink-0"
                style={{
                  color: "#EF4444",
                  backgroundColor: "rgba(239,68,68,0.08)",
                }}
              >
                Déconnecter
              </button>
            ) : (
              <button
                onClick={() => handleConnect(integration.id)}
                className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors shrink-0 text-white"
                style={{ backgroundColor: integration.color }}
              >
                Connecter
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Analyze button */}
      {connectedCount > 0 && !analyzing && !results && (
        <button
          onClick={handleAnalyze}
          className="w-full py-4 rounded-xl text-white font-semibold text-sm transition-all"
          style={{
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
          }}
        >
          Lancer l'analyse sur {connectedCount} source{connectedCount > 1 ? "s" : ""}
        </button>
      )}

      {/* Progress */}
      {analyzing && progress && (
        <div
          className="rounded-xl p-6 space-y-4"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: "#0F172A" }}>
              {progress.step}
            </h3>
            <span className="text-sm font-bold" style={{ color: "#6366F1" }}>
              {progress.percent}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 rounded-full" style={{ backgroundColor: "#E2E8F0" }}>
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{
                width: `${progress.percent}%`,
                background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
              }}
            />
          </div>

          <p className="text-xs" style={{ color: "#94A3B8" }}>
            {progress.details}
          </p>

          {/* Pipeline visualization */}
          <div className="flex items-center gap-2 pt-2">
            {["Ingestion", "Normalisation", "Filtrage", "Extraction", "Détection", "Maps"].map(
              (label, i) => {
                const stepPercents = [15, 30, 50, 75, 90, 100];
                const done = progress.percent >= stepPercents[i];
                const active = !done && (i === 0 || progress.percent >= stepPercents[i - 1]);
                return (
                  <div key={label} className="flex items-center gap-2 flex-1">
                    <div
                      className="w-full h-1 rounded-full"
                      style={{
                        backgroundColor: done
                          ? "#6366F1"
                          : active
                            ? "#C7D2FE"
                            : "#E2E8F0",
                        transition: "background-color 0.5s",
                      }}
                    />
                  </div>
                );
              }
            )}
          </div>
          <div className="flex justify-between">
            {["Ingestion", "Filtrage", "Extraction", "Maps"].map((label, i) => (
              <span key={label} className="text-[9px]" style={{ color: "#94A3B8" }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div
          className="rounded-xl p-6 space-y-5"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(34,197,94,0.1)" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 10l3 3 7-7"
                  stroke="#22C55E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "#0F172A" }}>
                Analyse terminée
              </h3>
              <p className="text-xs" style={{ color: "#94A3B8" }}>
                Vos process ont été détectés et cartographiés
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <ResultStat value={results.events.toLocaleString()} label="Événements analysés" color="#3B82F6" />
            <ResultStat value={results.filtered.toLocaleString()} label="Interactions process" color="#8B5CF6" />
            <ResultStat value={String(results.processes)} label="Process détectés" color="#22C55E" />
          </div>

          {/* CTA */}
          <a
            href="/process-maps"
            className="block w-full text-center py-3 rounded-xl text-white font-semibold text-sm transition-all"
            style={{
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
            }}
          >
            Voir les Process Maps
          </a>
        </div>
      )}
    </div>
  );
}

function ResultStat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div
      className="rounded-lg p-4 text-center"
      style={{ backgroundColor: color + "08", border: `1px solid ${color}20` }}
    >
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-xs mt-1" style={{ color: "#64748B" }}>
        {label}
      </div>
    </div>
  );
}

function OutlookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#0078D4" strokeWidth="1.5" />
      <path d="M2 8l10 5 10-5" stroke="#0078D4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TeamsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#6264A7" strokeWidth="1.5" />
      <path d="M8 10h8M8 14h5" stroke="#6264A7" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AircallIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"
        stroke="#00B388"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
