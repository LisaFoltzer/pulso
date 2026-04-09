// Pipeline d'extraction sémantique Pulso
// En production : appels réels à Claude API
// Pour l'instant : simulation avec les résultats attendus

import type { RawEvent } from "./mock-emails";

// === ÉTAPE 1 : Normalisation ===

export type NormalizedEvent = {
  id: string;
  source: "outlook" | "teams" | "aircall";
  timestamp: string;
  from: { name: string; role: string; department: string };
  to: { name: string; role: string; department: string }[];
  subject: string;
  body: string;
  metadata?: Record<string, string>;
};

export function normalize(events: RawEvent[]): NormalizedEvent[] {
  // En production : nettoyage HTML, extraction headers, dédup
  return events.map((e) => ({
    ...e,
    body: e.body.slice(0, 500), // tronquer pour réduire les tokens
  }));
}

// === ÉTAPE 2 : Filtrage (Haiku) ===
// Prompt envoyé à Claude Haiku pour classifier chaque événement

export const HAIKU_FILTER_PROMPT = `Tu es un assistant qui classifie des interactions professionnelles.
Pour chaque événement, réponds UNIQUEMENT par "process" ou "bruit".

Règles :
- "process" = interaction qui fait partie d'un workflow métier (demande, validation, livraison, escalade, handoff, décision, etc.)
- "bruit" = newsletter, notification automatique, conversation sociale, spam

Réponds en JSON : { "id": "...", "classification": "process" | "bruit" }`;

export type FilterResult = {
  id: string;
  classification: "process" | "bruit";
};

// Simulation du filtrage Haiku
export function simulateHaikuFilter(events: NormalizedEvent[]): FilterResult[] {
  // Les IDs ev-1xx sont du bruit
  return events.map((e) => ({
    id: e.id,
    classification: e.id.startsWith("ev-10") ? "bruit" : "process",
  }));
}

// === ÉTAPE 3 : Extraction sémantique (Sonnet) ===
// Prompt envoyé à Claude Sonnet pour extraire les actions sémantiques

export const SONNET_EXTRACTION_PROMPT = `Tu es un analyste de process métier. Tu reçois des interactions professionnelles (emails, messages, appels).

Pour chaque interaction, extrais une "action sémantique" au format JSON :
{
  "event_id": "...",
  "action_type": "demande" | "validation" | "approbation" | "escalade" | "livraison" | "notification" | "handoff" | "décision" | "information",
  "from_role": "...",       // rôle, PAS le nom de la personne
  "from_department": "...",
  "to_role": "...",
  "to_department": "...",
  "summary": "...",         // résumé en 1 phrase de l'action
  "urgency": "low" | "medium" | "high",
  "process_hint": "..."    // ton estimation du process auquel ça appartient
}

IMPORTANT :
- Ne mentionne JAMAIS de noms de personnes, uniquement des rôles et départements
- Concentre-toi sur le FLUX, pas sur les individus
- Identifie les patterns : handoff, escalade, validation, boucle de feedback`;

export type SemanticAction = {
  event_id: string;
  action_type: string;
  from_role: string;
  from_department: string;
  to_role: string;
  to_department: string;
  summary: string;
  urgency: "low" | "medium" | "high";
  process_hint: string;
};

// Simulation de l'extraction Sonnet
export function simulateSonnetExtraction(
  events: NormalizedEvent[]
): SemanticAction[] {
  const actionMap: Record<string, SemanticAction> = {
    "ev-001": {
      event_id: "ev-001",
      action_type: "handoff",
      from_role: "Account Executive",
      from_department: "Sales",
      to_role: "CSM Lead",
      to_department: "Customer Success",
      summary: "Handoff d'un nouveau client signé vers l'équipe Customer Success pour démarrage onboarding",
      urgency: "high",
      process_hint: "Onboarding Client",
    },
    "ev-002": {
      event_id: "ev-002",
      action_type: "demande",
      from_role: "CSM Lead",
      from_department: "Customer Success",
      to_role: "Solutions Engineer",
      to_department: "Tech",
      summary: "Demande de préparation d'un environnement de test pour le nouveau client",
      urgency: "high",
      process_hint: "Onboarding Client",
    },
    "ev-003": {
      event_id: "ev-003",
      action_type: "validation",
      from_role: "Solutions Engineer",
      from_department: "Tech",
      to_role: "CSM Lead",
      to_department: "Customer Success",
      summary: "Confirmation de prise en charge de la préparation technique, demande d'informations complémentaires",
      urgency: "medium",
      process_hint: "Onboarding Client",
    },
    "ev-004": {
      event_id: "ev-004",
      action_type: "demande",
      from_role: "CSM Lead",
      from_department: "Customer Success",
      to_role: "Ops Manager",
      to_department: "Operations",
      summary: "Demande de création de compte entreprise dans le système avant le kick-off",
      urgency: "high",
      process_hint: "Onboarding Client",
    },
    "ev-005": {
      event_id: "ev-005",
      action_type: "livraison",
      from_role: "CSM Lead",
      from_department: "Customer Success",
      to_role: "Client",
      to_department: "Externe",
      summary: "Appel de bienvenue avec présentation de l'équipe et planning d'onboarding",
      urgency: "high",
      process_hint: "Onboarding Client",
    },
    "ev-006": {
      event_id: "ev-006",
      action_type: "information",
      from_role: "CSM Lead",
      from_department: "Customer Success",
      to_role: "Solutions Engineer, Ops Manager",
      to_department: "Tech, Operations",
      summary: "Compte-rendu du kick-off avec liste d'actions à réaliser par chaque équipe",
      urgency: "high",
      process_hint: "Onboarding Client",
    },
    "ev-010": {
      event_id: "ev-010",
      action_type: "demande",
      from_role: "Sales Rep",
      from_department: "Sales",
      to_role: "Sales Admin",
      to_department: "Sales",
      summary: "Transmission d'une nouvelle commande client avec demande de lancement du process",
      urgency: "high",
      process_hint: "Traitement Commande",
    },
    "ev-011": {
      event_id: "ev-011",
      action_type: "demande",
      from_role: "Sales Admin",
      from_department: "Sales",
      to_role: "Comptable",
      to_department: "Finance",
      summary: "Demande de validation du paiement avant traitement de la commande",
      urgency: "medium",
      process_hint: "Traitement Commande",
    },
    "ev-012": {
      event_id: "ev-012",
      action_type: "approbation",
      from_role: "Comptable",
      from_department: "Finance",
      to_role: "Sales Admin",
      to_department: "Sales",
      summary: "Validation du paiement et autorisation de lancer la préparation",
      urgency: "medium",
      process_hint: "Traitement Commande",
    },
    "ev-013": {
      event_id: "ev-013",
      action_type: "demande",
      from_role: "Sales Admin",
      from_department: "Sales",
      to_role: "Responsable Logistique",
      to_department: "Operations",
      summary: "Ordre d'expédition avec détails de livraison et date limite",
      urgency: "high",
      process_hint: "Traitement Commande",
    },
    "ev-014": {
      event_id: "ev-014",
      action_type: "livraison",
      from_role: "Responsable Logistique",
      from_department: "Operations",
      to_role: "Client",
      to_department: "Externe",
      summary: "Notification d'expédition avec numéro de suivi au client",
      urgency: "medium",
      process_hint: "Traitement Commande",
    },
    "ev-020": {
      event_id: "ev-020",
      action_type: "demande",
      from_role: "Client",
      from_department: "Externe",
      to_role: "Agent Support N1",
      to_department: "Support",
      summary: "Signalement d'un problème de connexion (erreur 403) par le client",
      urgency: "high",
      process_hint: "Support Technique",
    },
    "ev-021": {
      event_id: "ev-021",
      action_type: "escalade",
      from_role: "Agent Support N1",
      from_department: "Support",
      to_role: "Support N2",
      to_department: "Support",
      summary: "Escalade vers le support N2 pour un bug identifié comme récurrent",
      urgency: "high",
      process_hint: "Support Technique",
    },
    "ev-022": {
      event_id: "ev-022",
      action_type: "information",
      from_role: "Support N2",
      from_department: "Support",
      to_role: "Agent Support N1",
      to_department: "Support",
      summary: "Diagnostic confirmé et hotfix en cours de déploiement",
      urgency: "high",
      process_hint: "Support Technique",
    },
    "ev-023": {
      event_id: "ev-023",
      action_type: "escalade",
      from_role: "Support N2",
      from_department: "Support",
      to_role: "Product Manager",
      to_department: "Product",
      summary: "Remontée d'un bug récurrent au Product avec recommandation d'améliorer le process de déploiement",
      urgency: "medium",
      process_hint: "Support Technique",
    },
    "ev-024": {
      event_id: "ev-024",
      action_type: "livraison",
      from_role: "Agent Support N1",
      from_department: "Support",
      to_role: "Client",
      to_department: "Externe",
      summary: "Notification de résolution du problème au client",
      urgency: "medium",
      process_hint: "Support Technique",
    },
    "ev-030": {
      event_id: "ev-030",
      action_type: "information",
      from_role: "CSM Lead",
      from_department: "Customer Success",
      to_role: "Billing Specialist",
      to_department: "Finance",
      summary: "Transmission des données d'usage mensuel pour la préparation de la facturation",
      urgency: "medium",
      process_hint: "Facturation",
    },
    "ev-031": {
      event_id: "ev-031",
      action_type: "demande",
      from_role: "Billing Specialist",
      from_department: "Finance",
      to_role: "CFO",
      to_department: "Finance",
      summary: "Demande de validation des factures dépassant le seuil avant envoi",
      urgency: "medium",
      process_hint: "Facturation",
    },
    "ev-032": {
      event_id: "ev-032",
      action_type: "approbation",
      from_role: "CFO",
      from_department: "Finance",
      to_role: "Billing Specialist",
      to_department: "Finance",
      summary: "Approbation des factures avec demande de vérification sur un tarif spécifique",
      urgency: "medium",
      process_hint: "Facturation",
    },
    "ev-033": {
      event_id: "ev-033",
      action_type: "handoff",
      from_role: "Billing Specialist",
      from_department: "Finance",
      to_role: "Comptable",
      to_department: "Finance",
      summary: "Transmission des factures validées pour enregistrement comptable",
      urgency: "low",
      process_hint: "Facturation",
    },
  };

  return events
    .filter((e) => actionMap[e.id])
    .map((e) => actionMap[e.id]);
}

// === ÉTAPE 4 : Détection de process (Sonnet batch) ===

export const PROCESS_DETECTION_PROMPT = `Tu es un expert en analyse de process métier.

Tu reçois une liste d'actions sémantiques extraites des communications d'une entreprise.

Ton travail :
1. Identifier les PROCESS métier récurrents en regroupant les actions liées
2. Pour chaque process, définir :
   - Les ÉTAPES (dans l'ordre chronologique)
   - Les RÔLES impliqués (pas de noms, que des fonctions)
   - Les FLUX entre rôles (qui passe quoi à qui)
   - Un SCORE de santé (0-100) basé sur : fluidité, goulots, temps, escalades
3. Identifier les PROBLÈMES : goulots d'étranglement, boucles inutiles, étapes manquantes

IMPORTANT :
- Raisonne en termes de PROCESS et de FLUX, jamais en termes de performance individuelle
- Les nœuds sont des RÔLES, pas des personnes
- Les scores évaluent le PROCESS, pas les gens

Format de sortie JSON :
{
  "processes": [{
    "name": "...",
    "description": "...",
    "steps": ["..."],
    "roles": [{ "id": "...", "label": "...", "department": "..." }],
    "flows": [{ "from": "...", "to": "...", "type": "...", "volume_hint": "high|medium|low" }],
    "score": 0-100,
    "status": "healthy|warning|critical",
    "insights": ["..."],
    "bottleneck": "..." | null
  }]
}`;

export type DetectedProcessResult = {
  name: string;
  description: string;
  steps: string[];
  roles: { id: string; label: string; department: string }[];
  flows: { from: string; to: string; type: string; volume_hint: string }[];
  score: number;
  status: "healthy" | "warning" | "critical";
  insights: string[];
  bottleneck: string | null;
};

// Simulation de la détection de process
export function simulateProcessDetection(
  _actions: SemanticAction[]
): DetectedProcessResult[] {
  return [
    {
      name: "Onboarding Client",
      description:
        "Process d'accueil des nouveaux clients, du handoff commercial au premier usage produit.",
      steps: [
        "Handoff Sales → CS",
        "Brief technique",
        "Setup compte",
        "Kick-off client",
        "Configuration technique",
        "Formation & Go-live",
      ],
      roles: [
        { id: "ae", label: "Account Executive", department: "Sales" },
        { id: "csm", label: "CSM Lead", department: "Customer Success" },
        { id: "se", label: "Solutions Engineer", department: "Tech" },
        { id: "ops", label: "Ops Manager", department: "Operations" },
        { id: "client", label: "Client", department: "Externe" },
      ],
      flows: [
        { from: "ae", to: "csm", type: "handoff", volume_hint: "high" },
        { from: "csm", to: "se", type: "demande", volume_hint: "high" },
        { from: "csm", to: "ops", type: "demande", volume_hint: "high" },
        { from: "se", to: "ops", type: "information", volume_hint: "medium" },
        { from: "csm", to: "client", type: "livraison", volume_hint: "high" },
        { from: "ops", to: "client", type: "notification", volume_hint: "medium" },
      ],
      score: 92,
      status: "healthy",
      insights: [
        "Process fluide avec un bon handoff entre Sales et CS",
        "Le kick-off client est systématiquement réalisé sous 5 jours",
        "La préparation technique et le setup compte se font en parallèle — efficace",
      ],
      bottleneck: null,
    },
    {
      name: "Traitement Commande",
      description:
        "Réception, validation et expédition des commandes clients.",
      steps: [
        "Réception commande",
        "Validation paiement",
        "Ordre d'expédition",
        "Préparation",
        "Expédition & tracking",
      ],
      roles: [
        { id: "sales", label: "Sales Rep", department: "Sales" },
        { id: "admin", label: "Sales Admin", department: "Sales" },
        { id: "finance", label: "Comptable", department: "Finance" },
        { id: "logistique", label: "Resp. Logistique", department: "Operations" },
        { id: "client", label: "Client", department: "Externe" },
      ],
      flows: [
        { from: "sales", to: "admin", type: "demande", volume_hint: "high" },
        { from: "admin", to: "finance", type: "demande", volume_hint: "high" },
        { from: "finance", to: "admin", type: "approbation", volume_hint: "high" },
        { from: "admin", to: "logistique", type: "demande", volume_hint: "high" },
        { from: "logistique", to: "client", type: "livraison", volume_hint: "high" },
      ],
      score: 78,
      status: "warning",
      insights: [
        "La validation paiement ajoute un délai systématique de 4-6h",
        "Le passage Sales → Admin est un goulot : tout transite par une seule personne",
        "Opportunité : automatiser la validation pour les clients avec historique de paiement fiable",
      ],
      bottleneck: "Validation paiement par la Finance — délai moyen de 4.2h",
    },
    {
      name: "Support Technique N1",
      description:
        "Traitement des demandes de support client avec escalade N2 si nécessaire.",
      steps: [
        "Réception demande",
        "Diagnostic N1",
        "Résolution ou Escalade N2",
        "Résolution N2",
        "Notification client",
      ],
      roles: [
        { id: "client", label: "Client", department: "Externe" },
        { id: "n1", label: "Agent Support N1", department: "Support" },
        { id: "n2", label: "Support N2", department: "Support" },
        { id: "pm", label: "Product Manager", department: "Product" },
      ],
      flows: [
        { from: "client", to: "n1", type: "demande", volume_hint: "high" },
        { from: "n1", to: "client", type: "livraison", volume_hint: "high" },
        { from: "n1", to: "n2", type: "escalade", volume_hint: "medium" },
        { from: "n2", to: "n1", type: "information", volume_hint: "medium" },
        { from: "n2", to: "pm", type: "escalade", volume_hint: "low" },
      ],
      score: 85,
      status: "healthy",
      insights: [
        "80% des tickets résolus en N1 — bon taux de résolution premier niveau",
        "Les escalades N2 sont pertinentes et bien documentées",
        "Problème détecté : des bugs récurrents remontent plusieurs fois sans correction en prod",
      ],
      bottleneck: null,
    },
    {
      name: "Facturation Mensuelle",
      description:
        "Cycle complet de facturation : collecte usage, génération, validation, envoi.",
      steps: [
        "Collecte données usage",
        "Génération factures",
        "Validation CFO",
        "Envoi clients",
        "Enregistrement comptable",
      ],
      roles: [
        { id: "csm", label: "CSM Lead", department: "Customer Success" },
        { id: "billing", label: "Billing Specialist", department: "Finance" },
        { id: "cfo", label: "CFO", department: "Finance" },
        { id: "compta", label: "Comptable", department: "Finance" },
        { id: "client", label: "Client", department: "Externe" },
      ],
      flows: [
        { from: "csm", to: "billing", type: "information", volume_hint: "medium" },
        { from: "billing", to: "cfo", type: "demande", volume_hint: "medium" },
        { from: "cfo", to: "billing", type: "approbation", volume_hint: "medium" },
        { from: "billing", to: "compta", type: "handoff", volume_hint: "medium" },
        { from: "compta", to: "client", type: "livraison", volume_hint: "medium" },
      ],
      score: 64,
      status: "critical",
      insights: [
        "Le cycle complet prend 6+ jours — trop long pour une facturation mensuelle",
        "La validation CFO crée un goulot majeur : délai moyen de 1.5 jours",
        "Les données usage arrivent souvent en retard du CS → décale toute la chaîne",
        "Recommandation : automatiser la génération et instaurer un seuil de validation auto sous 5K€",
      ],
      bottleneck: "Validation CFO — 1.5 jours de délai moyen, bloque toute la chaîne",
    },
  ];
}

// === PIPELINE COMPLET ===

export type PipelineResult = {
  totalEvents: number;
  filteredOut: number;
  processEvents: number;
  semanticActions: SemanticAction[];
  detectedProcesses: DetectedProcessResult[];
};

export function runPipeline(events: RawEvent[]): PipelineResult {
  // 1. Normalize
  const normalized = normalize(events);

  // 2. Filter (Haiku)
  const filterResults = simulateHaikuFilter(normalized);
  const processEventIds = new Set(
    filterResults.filter((r) => r.classification === "process").map((r) => r.id)
  );
  const processEvents = normalized.filter((e) => processEventIds.has(e.id));

  // 3. Extract (Sonnet)
  const actions = simulateSonnetExtraction(processEvents);

  // 4. Detect processes (Sonnet batch)
  const processes = simulateProcessDetection(actions);

  return {
    totalEvents: events.length,
    filteredOut: events.length - processEvents.length,
    processEvents: processEvents.length,
    semanticActions: actions,
    detectedProcesses: processes,
  };
}
