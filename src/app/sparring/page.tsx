"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useAnalysis, buildSparringContext } from "@/lib/store";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  metrics?: Metric[];
  scenario?: Scenario;
};

type Metric = { label: string; value: string; color: string; trend?: string };
type Scenario = { title: string; options: { name: string; impact: string; effort: string; roi: string; color: string }[] };

const QUICK_PROMPTS = [
  { label: "Quel process optimiser en priorité ?", icon: "🎯", color: "#EF4444" },
  { label: "Simule l'impact si on automatise la validation paiement", icon: "⚡", color: "#3B82F6" },
  { label: "Compare : réorganiser vs automatiser la facturation", icon: "⚖️", color: "#10B981" },
  { label: "Si je recrute une personne, quel impact ?", icon: "👤", color: "#8B5CF6" },
  { label: "Quel est le ROI de corriger le goulot facturation ?", icon: "💰", color: "#22C55E" },
  { label: "Quels risques opérationnels si Léa est absente ?", icon: "🚨", color: "#F59E0B" },
];

const CONTEXT_CARDS = [
  { label: "Score global", value: "82", unit: "/100", color: "#22C55E", trend: "-3" },
  { label: "Process critiques", value: "1", unit: "", color: "#EF4444", trend: "+1" },
  { label: "Goulot principal", value: "1.5j", unit: "", color: "#F59E0B", trend: "stable" },
  { label: "Potentiel d'économie", value: "32h", unit: "/mois", color: "#3B82F6", trend: "" },
];

const PROCESS_HEALTH = [
  { name: "Onboarding Client", score: 92, color: "#22C55E" },
  { name: "Support Technique", score: 85, color: "#22C55E" },
  { name: "Traitement Commandes", score: 78, color: "#EAB308" },
  { name: "Facturation", score: 64, color: "#EF4444" },
];

// Simulated rich responses
function getSimulatedResponse(userMsg: string): Message {
  const lower = userMsg.toLowerCase();

  if (lower.includes("priorité") || lower.includes("optimiser")) {
    return {
      id: 0, role: "assistant", timestamp: "",
      content: `J'ai classé tes process par **ratio impact/effort**. Voici le ranking :

**#1 — Facturation Mensuelle** (score 64)
Le goulot CFO de 1.5j est le plus facile à résoudre pour le plus gros gain. Un seuil d'auto-validation à 5K€ élimine le goulot pour 67% du volume.

**#2 — Traitement Commandes** (score 78)
La validation paiement à 4.2h est un quick win si tu automatises pour les clients récurrents.

**#3 — Support Technique** (score 85)
Déjà bon, mais le bug récurrent non déployé coûte en satisfaction client.

L'onboarding à 92 tourne bien — n'y touche pas.

**Mon conseil :** Commence par la facturation. C'est le meilleur ROI.`,
      metrics: [
        { label: "Gain estimé facturation", value: "10h/mois", color: "#22C55E", trend: "ESTIMATION" },
        { label: "Gain estimé commandes", value: "8h/mois", color: "#3B82F6", trend: "ESTIMATION" },
        { label: "ROI cumulé", value: "~2 700€/mois", color: "#8B5CF6", trend: "ESTIMATION" },
      ],
    };
  }

  if (lower.includes("simul") || lower.includes("automat") || lower.includes("impact")) {
    return {
      id: 0, role: "assistant", timestamp: "",
      content: `Voici la **simulation** de l'automatisation de la validation paiement :`,
      metrics: [
        { label: "Temps actuel par commande", value: "4.2h", color: "#EF4444" },
        { label: "Temps après auto-validation", value: "0h", color: "#22C55E" },
        { label: "Commandes éligibles", value: "78%", color: "#3B82F6", trend: "clients >6 mois, 0 impayé" },
        { label: "Gain mensuel", value: "~32h", color: "#22C55E", trend: "ESTIMATION" },
      ],
      scenario: {
        title: "SIMULATION : Auto-validation paiement",
        options: [
          { name: "Scénario A — Seuil montant", impact: "Auto-valide si < 5K€", effort: "Faible (config)", roi: "~24h/mois", color: "#22C55E" },
          { name: "Scénario B — Seuil confiance client", impact: "Auto-valide clients fiables (>6 mois)", effort: "Moyen (scoring)", roi: "~32h/mois", color: "#3B82F6" },
          { name: "Scénario C — Full auto + alertes", impact: "Tout auto-validé, alerte si anomalie", effort: "Élevé (ML)", roi: "~38h/mois", color: "#8B5CF6" },
        ],
      },
    };
  }

  if (lower.includes("compare") || lower.includes("réorganiser")) {
    return {
      id: 0, role: "assistant", timestamp: "",
      content: `Bonne question. Voici la **comparaison** des deux approches pour la facturation :`,
      scenario: {
        title: "COMPARAISON : Réorganiser vs Automatiser",
        options: [
          { name: "Réorganiser", impact: "Supprimer la validation CFO, déléguer au billing", effort: "Politique (convaincre le CFO)", roi: "Cycle ÷2 (~3j)", color: "#F59E0B" },
          { name: "Automatiser", impact: "Seuil auto-validation + notif CFO", effort: "Technique (2-3 jours dev)", roi: "Cycle ÷3 (~2j)", color: "#3B82F6" },
          { name: "Les deux", impact: "Auto-validation + délégation des cas complexes", effort: "Moyen (politique + technique)", roi: "Cycle ÷4 (~1.5j)", color: "#22C55E" },
        ],
      },
      metrics: [
        { label: "Cycle actuel", value: "6.1 jours", color: "#EF4444" },
        { label: "Meilleur scénario", value: "~1.5 jours", color: "#22C55E", trend: "ESTIMATION ÷4" },
      ],
    };
  }

  if (lower.includes("recrute") || lower.includes("personne")) {
    return {
      id: 0, role: "assistant", timestamp: "",
      content: `Question intéressante. Laisse-moi regarder où le manque se fait sentir.

**Le problème #1 :** Tes 2 personnes les plus actives centralisent 66% des communications. C'est un **risque opérationnel majeur**.

**Où placer un recrutement :**

**Option A — Ops/Admin** (recommandé)
Le traitement commandes a un bottleneck sur l'admin qui gère tout seul la validation + logistique. Un assistant diviserait la charge.
→ Impact : validation paiement de 4.2h → ~1h

**Option B — Finance/Billing**
La facturation est critique (score 64). Un billing specialist dédié libère le cycle.
→ Impact : cycle facturation de 6j → ~3j

**Option C — Support N2**
Le support N1 résout 80%, mais les 20% restants surchargent le N2 qui est seul.
→ Impact : temps de résolution N2 ÷2

**Mon avis :** Option A. C'est là que la concentration de charge est la plus dangereuse.`,
      metrics: [
        { label: "Concentration charge", value: "66%", color: "#EF4444", trend: "sur 2 personnes" },
        { label: "Coût d'un recrutement", value: "~3 500€/mois", color: "#94A3B8", trend: "ESTIMATION salaire chargé" },
        { label: "Gain Option A", value: "~24h/mois", color: "#22C55E", trend: "ESTIMATION" },
      ],
    };
  }

  // Default
  return {
    id: 0, role: "assistant", timestamp: "",
    content: `Bonne question. Voici ce que les données montrent.

**En résumé :** Ton principal levier d'amélioration est la **facturation mensuelle** (score 64). Le goulot de validation CFO coûte 1.5 jours par cycle.

L'automatisation de la validation paiement dans le traitement commandes est le **quick win** le plus rentable : ESTIMATION ~32h/mois économisées pour un effort technique faible.

Qu'est-ce que tu veux approfondir ?`,
    metrics: [
      { label: "Process le plus critique", value: "Facturation (64)", color: "#EF4444" },
      { label: "Quick win principal", value: "32h/mois", color: "#22C55E", trend: "ESTIMATION" },
    ],
  };
}

export default function SparringPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  const { analysis } = useAnalysis();
  const sparringContext = useMemo(() => buildSparringContext(analysis), [analysis]);
  const hasRealData = analysis && analysis.processes.length > 0;

  // Dynamic process health from real data
  const processHealth = hasRealData
    ? analysis.processes.map((p) => ({
        name: p.name,
        score: p.score,
        color: p.score >= 80 ? "#22C55E" : p.score >= 60 ? "#EAB308" : "#EF4444",
      }))
    : PROCESS_HEALTH;

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-start from Process Maps link
  useEffect(() => {
    const question = sessionStorage.getItem("sparring_question");
    if (question && !started) {
      sessionStorage.removeItem("sparring_question");
      startChat();
      setTimeout(() => sendMessage(question), 2500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const now = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { id: messages.length, role: "user", content: text.trim(), timestamp: now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/sparring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          context: sparringContext,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { id: prev.length, role: "assistant", content: data.text, timestamp: now() },
      ]);
    } catch {
      await new Promise((r) => setTimeout(r, 1800));
      const simulated = getSimulatedResponse(text);
      simulated.id = messages.length + 1;
      simulated.timestamp = now();
      setMessages((prev) => [...prev, simulated]);
    }
    setIsTyping(false);
  }

  function startChat() {
    setStarted(true);
    setIsTyping(true);
    setTimeout(() => {
      setMessages([{
        id: 0, role: "assistant", timestamp: now(),
        content: `Salut. J'ai passé en revue tes données.

**État des lieux rapide :**
• Score global 82/100 — en baisse de 3 points cette semaine
• La facturation est en zone critique (64) — le CFO bloque le flux 1.5j
• Le traitement commandes se dégrade (78) — validation paiement à 4.2h
• Point positif : onboarding à 92, support à 85

**Le signal d'alarme :** 66% de tes communications passent par 2 personnes. Si l'une est absente, plusieurs process s'arrêtent.

De quoi tu veux qu'on parle ?`,
        metrics: [
          { label: "Tendance", value: "-3 pts", color: "#EF4444", trend: "cette semaine" },
          { label: "Risque concentration", value: "66%", color: "#F59E0B", trend: "2 personnes" },
        ],
      }]);
      setIsTyping(false);
    }, 1200);
  }

  // ═══ LOBBY ═══
  if (!started) {
    return (
      <div className="max-w-5xl mx-auto space-y-4 animate-fade-in" style={{ paddingTop: 6 }}>
        {/* Hero */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0F172A, #1E293B 60%, #334155)" }}>
          <div className="px-8 py-8 flex items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L3 6v8l7 4 7-4V6L10 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
                    <circle cx="10" cy="10" r="3" stroke="white" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
                <h1 className="text-lg font-bold text-white">Sparring Partner</h1>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#4ADE80" }}>
                  LIVE
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#94A3B8" }}>
                Un DG virtuel qui connaît vos données. Challengez vos décisions, simulez des scénarios, calculez le ROI de chaque option.
              </p>
              <button
                onClick={startChat}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "#FFFFFF", color: "#0F172A" }}
              >
                Démarrer →
              </button>
            </div>
            {/* Mini viz */}
            <div className="hidden lg:flex flex-col gap-2 shrink-0">
              {processHealth.map((p) => (
                <div key={p.name} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                  <div className="w-20">
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${p.score}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold tabular-nums" style={{ color: p.color, width: 24 }}>{p.score}</span>
                  <span className="text-[10px] font-medium" style={{ color: "#94A3B8", width: 120 }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Context cards */}
          <div className="lg:col-span-1 grid grid-cols-2 gap-3">
            {CONTEXT_CARDS.map((card) => (
              <div key={card.label} className="rounded-xl p-3" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
                <div className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: "#94A3B8" }}>{card.label}</div>
                <div className="flex items-baseline gap-0.5 mt-1">
                  <span className="text-xl font-bold" style={{ color: card.color }}>{card.value}</span>
                  <span className="text-[10px]" style={{ color: "#94A3B8" }}>{card.unit}</span>
                </div>
                {card.trend && (
                  <span className="text-[9px]" style={{ color: card.trend.startsWith("+") ? "#EF4444" : card.trend.startsWith("-") ? "#EF4444" : "#94A3B8" }}>
                    {card.trend}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Quick prompts */}
          <div className="lg:col-span-2 rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h3 className="text-[10px] font-bold uppercase tracking-wide mb-3" style={{ color: "#94A3B8" }}>
              Questions stratégiques
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { startChat(); setTimeout(() => sendMessage(p.label), 2500); }}
                  className="text-left text-[11px] font-medium px-3 py-2.5 rounded-lg transition-all hover:shadow-sm"
                  style={{ backgroundColor: p.color + "06", color: "#475569", border: `1px solid ${p.color}15` }}
                >
                  <span className="mr-1.5">{p.icon}</span>{p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══ CHAT ═══
  return (
    <div className="flex gap-4" style={{ height: "calc(100vh - 64px - 48px)" }}>
      {/* Main chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between py-2 px-4 mb-2 rounded-xl" style={{ backgroundColor: "#0F172A" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L2 4v6l5 3 5-3V4L7 1z" stroke="white" strokeWidth="1" strokeLinejoin="round" fill="none" />
                <circle cx="7" cy="7" r="2" fill="white" opacity="0.8" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">Sparring Partner</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22C55E" }} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPanel(!showPanel)}
              className="text-[10px] font-medium px-2.5 py-1 rounded-lg"
              style={{ color: "#94A3B8", backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              {showPanel ? "Masquer données" : "Voir données"}
            </button>
            <button
              onClick={() => { setStarted(false); setMessages([]); }}
              className="text-[10px] font-medium px-2.5 py-1 rounded-lg"
              style={{ color: "#94A3B8", backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              Nouvelle session
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto rounded-xl px-5 py-4 space-y-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
          {messages.map((msg) => (
            <div key={msg.id} className={`${msg.role === "user" ? "flex justify-end" : ""} animate-fade-in`}>
              {msg.role === "assistant" && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1" style={{ backgroundColor: "#0F172A" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1L2 3v6l4 2 4-2V3L6 1z" stroke="white" strokeWidth="0.8" fill="none" />
                      <circle cx="6" cy="6" r="1.5" fill="white" opacity="0.8" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="rounded-2xl rounded-bl-sm px-4 py-3 text-[13px] leading-relaxed" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                      {msg.content.split("\n").map((line, i) => {
                        if (!line.trim()) return <div key={i} className="h-2" />;

                        // H2 headers
                        if (line.startsWith("## ")) {
                          const text = line.slice(3).replace(/\*\*(.+?)\*\*/g, '$1');
                          return (
                            <div key={i} className="mt-3 mb-1.5 pb-1.5" style={{ borderBottom: "1px solid #E2E8F0" }}>
                              <span className="text-xs font-bold" style={{ color: "#0F172A" }}>{text}</span>
                            </div>
                          );
                        }

                        // ROI / key metric lines
                        if (line.includes("ROI") || line.includes("Économie") || line.includes("ESTIMATION")) {
                          const rendered = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                          return (
                            <div key={i} className="mt-1 px-2.5 py-1.5 rounded-lg text-xs" style={{ backgroundColor: "#22C55E10", border: "1px solid #22C55E20" }}>
                              <span dangerouslySetInnerHTML={{ __html: rendered }} />
                            </div>
                          );
                        }

                        // Coût lines
                        if (line.includes("Coût")) {
                          const rendered = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                          return (
                            <div key={i} className="mt-1 px-2.5 py-1.5 rounded-lg text-xs" style={{ backgroundColor: "#F59E0B10", border: "1px solid #F59E0B20" }}>
                              <span dangerouslySetInnerHTML={{ __html: rendered }} />
                            </div>
                          );
                        }

                        // Option headers
                        if (line.match(/^#{0,2}\s*(OPTION|Option)\s/)) {
                          const text = line.replace(/^#{1,2}\s*/, "").replace(/\*\*(.+?)\*\*/g, '$1');
                          return (
                            <div key={i} className="mt-3 mb-1 flex items-center gap-2">
                              <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: "#6366F1" }} />
                              <span className="text-xs font-bold" style={{ color: "#0F172A" }}>{text}</span>
                            </div>
                          );
                        }

                        // Bullet points
                        if (line.startsWith("- ") || line.startsWith("• ")) {
                          const text = line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                          return (
                            <div key={i} className="flex items-start gap-2 mt-0.5 ml-2">
                              <span className="text-[8px] mt-1.5" style={{ color: "#CBD5E1" }}>●</span>
                              <span className="text-xs" style={{ color: "#475569" }} dangerouslySetInnerHTML={{ __html: text }} />
                            </div>
                          );
                        }

                        // Bold whole line (like "MA RECOMMANDATION :")
                        if (line.match(/^[A-ZÉÈÊ\s]{3,}:/) || line.includes("RECOMMANDATION") || line.includes("IMPORTANT")) {
                          const rendered = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                          return (
                            <div key={i} className="mt-2 px-2.5 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: "#6366F110", color: "#4338CA" }}>
                              <span dangerouslySetInnerHTML={{ __html: rendered }} />
                            </div>
                          );
                        }

                        // Default paragraph with bold
                        const rendered = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                        return <p key={i} className={i > 0 ? "mt-1.5" : ""} dangerouslySetInnerHTML={{ __html: rendered }} />;
                      })}
                    </div>

                    {/* Inline metrics */}
                    {msg.metrics && msg.metrics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.metrics.map((m, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: m.color + "08", border: `1px solid ${m.color}20` }}>
                            <div>
                              <div className="text-[9px] font-medium" style={{ color: "#94A3B8" }}>{m.label}</div>
                              <div className="text-sm font-bold" style={{ color: m.color }}>{m.value}</div>
                            </div>
                            {m.trend && (
                              <span className="text-[8px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: "#F8FAFC", color: "#94A3B8" }}>
                                {m.trend}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Scenario comparison */}
                    {msg.scenario && (
                      <div className="mt-3 rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
                        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                          {msg.scenario.title}
                        </div>
                        {msg.scenario.options.map((opt, i) => (
                          <div key={i} className="px-4 py-3 flex items-start gap-3" style={{ borderBottom: i < msg.scenario!.options.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                            <div className="w-1.5 h-full rounded-full shrink-0 mt-1" style={{ backgroundColor: opt.color, minHeight: 32 }} />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold" style={{ color: "#0F172A" }}>{opt.name}</div>
                              <div className="text-[11px] mt-0.5" style={{ color: "#64748B" }}>{opt.impact}</div>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}>
                                  Effort: {opt.effort}
                                </span>
                                <span className="text-[9px] font-bold" style={{ color: opt.color }}>
                                  ROI: {opt.roi}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {msg.role === "user" && (
                <div className="max-w-[75%] rounded-2xl rounded-br-sm px-4 py-3 text-[13px] leading-relaxed" style={{ backgroundColor: "#0F172A", color: "#FFFFFF" }}>
                  {msg.content}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#0F172A" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1L2 3v6l4 2 4-2V3L6 1z" stroke="white" strokeWidth="0.8" fill="none" />
                  <circle cx="6" cy="6" r="1.5" fill="white" opacity="0.8" />
                </svg>
              </div>
              <div className="rounded-2xl rounded-bl-sm px-4 py-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <div className="flex gap-1 items-center h-5">
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "#0F172A" }} />
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "#0F172A", animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "#0F172A", animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts at start */}
        {messages.length <= 1 && !isTyping && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {QUICK_PROMPTS.slice(0, 4).map((p) => (
              <button key={p.label} onClick={() => sendMessage(p.label)} className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg" style={{ backgroundColor: "#FFF", color: "#475569", border: "1px solid #E2E8F0" }}>
                {p.icon} {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="mt-2">
          <div className="flex items-center gap-2 rounded-xl px-4 py-1.5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Posez votre question stratégique..."
              className="flex-1 text-sm outline-none py-2"
              style={{ color: "#0F172A" }}
              disabled={isTyping}
              autoFocus
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-20"
              style={{ backgroundColor: "#0F172A" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Right panel — live data */}
      {showPanel && (
        <div className="w-[240px] shrink-0 flex flex-col gap-3 animate-slide-in-right">
          {/* Process health */}
          <div className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h3 className="text-[9px] font-bold uppercase tracking-wide mb-3" style={{ color: "#94A3B8" }}>Santé des process</h3>
            {processHealth.map((p) => (
              <div key={p.name} className="flex items-center gap-2 mb-2.5 last:mb-0">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium" style={{ color: "#475569" }}>{p.name}</span>
                    <span className="text-[10px] font-bold tabular-nums" style={{ color: p.color }}>{p.score}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: "#F1F5F9" }}>
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${p.score}%`, backgroundColor: p.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key metrics */}
          <div className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h3 className="text-[9px] font-bold uppercase tracking-wide mb-3" style={{ color: "#94A3B8" }}>Métriques clés</h3>
            {[
              { label: "Emails analysés", value: "3 474", icon: "📧" },
              { label: "Personnes détectées", value: "345", icon: "👥" },
              { label: "Process actifs", value: "24", icon: "🔄" },
              { label: "Anomalies", value: "4", icon: "⚠️" },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid #F8FAFC" }}>
                <span className="text-[10px]" style={{ color: "#94A3B8" }}>{m.icon} {m.label}</span>
                <span className="text-[10px] font-bold tabular-nums" style={{ color: "#0F172A" }}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h3 className="text-[9px] font-bold uppercase tracking-wide mb-3" style={{ color: "#94A3B8" }}>Actions rapides</h3>
            {[
              { label: "Voir Process Maps", href: "/process-maps" },
              { label: "Voir Insights", href: "/insights" },
              { label: "Voir Timeline", href: "/timeline" },
            ].map((a) => (
              <a key={a.label} href={a.href} className="block text-[10px] font-medium py-1.5 transition-colors hover:text-indigo-600" style={{ color: "#6366F1" }}>
                {a.label} →
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
