// Unified Event System — All sources produce one of 2 event types
//
// TYPE 1: Communication Events (emails, messages, calls)
//   → WHO talks to WHO, WHEN, about WHAT, via WHICH channel
//   → Used to detect: flows, handoffs, bottlenecks, escalations
//
// TYPE 2: Work Events (project tools, CRM, tickets)
//   → WHAT changed, WHO did it, WHEN, what STATUS
//   → Used to detect: task flow, status progression, workload, deadlines
//
// The analysis pipeline combines both to get the full picture:
//   Communication shows HOW people coordinate
//   Work events show WHAT they're actually doing

export type CommunicationEvent = {
  id: string;
  type: "communication";
  source: "gmail" | "outlook" | "teams" | "slack" | "aircall";
  timestamp: string;
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  channel: "email" | "message" | "call" | "meeting";
  threadId?: string;
  metadata?: {
    duration?: number;      // call duration in seconds
    direction?: "inbound" | "outbound";
    hasAttachments?: boolean;
    meetingType?: "scheduled" | "ad-hoc";
  };
};

export type WorkEvent = {
  id: string;
  type: "work";
  source: "notion" | "trello" | "asana" | "jira" | "monday" | "hubspot" | "pipedrive";
  timestamp: string;
  actor: string;            // who did the action
  action: "created" | "updated" | "moved" | "completed" | "assigned" | "commented" | "archived";
  itemType: "task" | "page" | "deal" | "ticket" | "project" | "document";
  itemName: string;
  itemId: string;
  project?: string;         // project/board/database name
  statusFrom?: string;      // previous status
  statusTo?: string;        // new status
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  metadata?: {
    priority?: "low" | "medium" | "high" | "urgent";
    estimatedHours?: number;
    customFields?: Record<string, string>;
  };
};

export type UnifiedEvent = CommunicationEvent | WorkEvent;

// ── Source configurations ──

export type SourceConfig = {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: "communication" | "project" | "crm";
  description: string;
  authType: "oauth" | "api_key" | "basic";
  authUrl?: string;
  status: "available" | "coming_soon";
  eventTypes: string[];
  setupGuide: string;
};

export const allSources: SourceConfig[] = [
  // ── Communication ──
  {
    id: "gmail", name: "Gmail", icon: "EM", color: "#EA4335",
    category: "communication",
    description: "Emails envoyés et reçus, conversations",
    authType: "oauth", authUrl: "/api/auth/google",
    status: "available",
    eventTypes: ["email"],
    setupGuide: "Connectez votre compte Google pour analyser vos emails professionnels.",
  },
  {
    id: "outlook", name: "Microsoft Outlook", icon: "OL", color: "#0078D4",
    category: "communication",
    description: "Emails, calendrier, invitations",
    authType: "oauth", authUrl: "/api/auth/microsoft",
    status: "available",
    eventTypes: ["email", "meeting"],
    setupGuide: "Nécessite un compte Microsoft 365. L'admin doit créer une App Registration dans Azure.",
  },
  {
    id: "teams", name: "Microsoft Teams", icon: "TM", color: "#6264A7",
    category: "communication",
    description: "Messages canaux, chats, meetings",
    authType: "oauth", authUrl: "/api/auth/microsoft",
    status: "available",
    eventTypes: ["message", "meeting"],
    setupGuide: "Utilise le même connecteur Microsoft que Outlook.",
  },
  {
    id: "slack", name: "Slack", icon: "TM", color: "#4A154B",
    category: "communication",
    description: "Messages canaux, DMs, threads",
    authType: "oauth",
    status: "coming_soon",
    eventTypes: ["message"],
    setupGuide: "Bientôt disponible.",
  },
  {
    id: "aircall", name: "Aircall", icon: "AC", color: "#00B388",
    category: "communication",
    description: "Appels entrants/sortants, durées, enregistrements",
    authType: "api_key", authUrl: "/api/auth/aircall",
    status: "available",
    eventTypes: ["call"],
    setupGuide: "Entrez votre API ID et API Token depuis le dashboard Aircall.",
  },

  // ── Project Tools ──
  {
    id: "notion", name: "Notion", icon: "NO", color: "#000000",
    category: "project",
    description: "Pages, bases de données, wikis, projets",
    authType: "oauth", authUrl: "/api/auth/notion",
    status: "available",
    eventTypes: ["task", "page", "document"],
    setupGuide: "Connectez votre workspace Notion pour analyser vos projets et tâches.",
  },
  {
    id: "trello", name: "Trello", icon: "TR", color: "#0052CC",
    category: "project",
    description: "Tableaux, cartes, listes, checklists",
    authType: "oauth",
    status: "coming_soon",
    eventTypes: ["task"],
    setupGuide: "Bientôt disponible.",
  },
  {
    id: "asana", name: "Asana", icon: "AS", color: "#F06A6A",
    category: "project",
    description: "Projets, tâches, sous-tâches, timelines",
    authType: "oauth",
    status: "coming_soon",
    eventTypes: ["task", "project"],
    setupGuide: "Bientôt disponible.",
  },
  {
    id: "monday", name: "Monday.com", icon: "MO", color: "#FF3D57",
    category: "project",
    description: "Boards, items, automations",
    authType: "api_key",
    status: "coming_soon",
    eventTypes: ["task", "project"],
    setupGuide: "Bientôt disponible.",
  },
  {
    id: "jira", name: "Jira", icon: "JI", color: "#0052CC",
    category: "project",
    description: "Issues, sprints, epics, workflows",
    authType: "oauth",
    status: "coming_soon",
    eventTypes: ["ticket", "task"],
    setupGuide: "Bientôt disponible.",
  },

  // ── CRM ──
  {
    id: "hubspot", name: "HubSpot", icon: "HS", color: "#FF7A59",
    category: "crm",
    description: "Contacts, deals, pipeline, emails trackés",
    authType: "oauth",
    status: "coming_soon",
    eventTypes: ["deal", "email", "task"],
    setupGuide: "Bientôt disponible.",
  },
  {
    id: "pipedrive", name: "Pipedrive", icon: "PD", color: "#017737",
    category: "crm",
    description: "Pipeline deals, activités, contacts",
    authType: "oauth",
    status: "coming_soon",
    eventTypes: ["deal", "task"],
    setupGuide: "Bientôt disponible.",
  },
  {
    id: "salesforce", name: "Salesforce", icon: "SF", color: "#00A1E0",
    category: "crm",
    description: "CRM complet, opportunités, contacts, cases",
    authType: "oauth",
    status: "coming_soon",
    eventTypes: ["deal", "ticket", "task"],
    setupGuide: "Bientôt disponible.",
  },

  // ── Accounting ──
  {
    id: "pennylane", name: "Pennylane", icon: "PL", color: "#1D4ED8",
    category: "crm" as const,
    description: "Comptabilite, salaires, factures fournisseurs",
    authType: "oauth" as const,
    authUrl: "/api/auth/pennylane",
    status: "available" as const,
    eventTypes: ["invoice"],
    setupGuide: "Connectez Pennylane pour lier les process a leurs couts reels.",
  },
  {
    id: "quickbooks", name: "QuickBooks", icon: "QB", color: "#2CA01C",
    category: "crm" as const,
    description: "Comptabilite, employes, factures, P&L",
    authType: "oauth" as const,
    status: "coming_soon" as const,
    eventTypes: ["invoice"],
    setupGuide: "Bientot disponible.",
  },
];

// ── Normalization helpers ──

export function normalizeGmailToEvent(email: {
  id: string; from: string; to: string; cc?: string; subject: string;
  date: string; body: string; threadId: string; hasAttachments?: boolean;
}): CommunicationEvent {
  return {
    id: email.id,
    type: "communication",
    source: "gmail",
    timestamp: email.date,
    from: email.from,
    to: email.to.split(",").map((t) => t.trim()).filter(Boolean),
    cc: email.cc?.split(",").map((t) => t.trim()).filter(Boolean),
    subject: email.subject,
    body: email.body,
    channel: "email",
    threadId: email.threadId,
    metadata: { hasAttachments: email.hasAttachments },
  };
}

export function normalizeNotionToEvents(items: {
  id: string; type: string; title: string; lastEdited: string; url?: string;
}[]): WorkEvent[] {
  return items.map((item) => ({
    id: item.id,
    type: "work" as const,
    source: "notion" as const,
    timestamp: item.lastEdited,
    actor: "",
    action: "updated" as const,
    itemType: item.type === "database" ? "project" as const : "page" as const,
    itemName: item.title,
    itemId: item.id,
    tags: [],
  }));
}

export function normalizeAircallToEvent(call: {
  id: string; from: string; to: string; date: string; duration?: number;
  direction?: string; body: string;
}): CommunicationEvent {
  return {
    id: String(call.id),
    type: "communication",
    source: "aircall",
    timestamp: call.date,
    from: call.from,
    to: [call.to],
    subject: `Appel ${call.direction || ""}`,
    body: call.body,
    channel: "call",
    metadata: {
      duration: call.duration,
      direction: call.direction as "inbound" | "outbound",
    },
  };
}

// ── Analysis prompt builder ──

export function buildAnalysisPromptFromEvents(
  commEvents: CommunicationEvent[],
  workEvents: WorkEvent[],
): string {
  let prompt = "";

  if (commEvents.length > 0) {
    prompt += `\n== DONNÉES DE COMMUNICATION (${commEvents.length} événements) ==
Ces données montrent QUI communique avec QUI, QUAND, et sur QUEL SUJET.
Utilise-les pour détecter les FLUX, HANDOFFS, ESCALADES et GOULOTS.

`;
    // Group by channel
    const emails = commEvents.filter((e) => e.channel === "email");
    const messages = commEvents.filter((e) => e.channel === "message");
    const calls = commEvents.filter((e) => e.channel === "call");

    if (emails.length) prompt += `📧 ${emails.length} emails\n`;
    if (messages.length) prompt += `💬 ${messages.length} messages\n`;
    if (calls.length) prompt += `📞 ${calls.length} appels\n`;
  }

  if (workEvents.length > 0) {
    prompt += `\n== DONNÉES DE TRAVAIL (${workEvents.length} événements) ==
Ces données montrent CE QUI EST FAIT : tâches, statuts, assignations, deadlines.
Utilise-les pour détecter les PROCESS DE TRAVAIL, la PROGRESSION et la CHARGE.

`;
    const bySource = new Map<string, number>();
    for (const e of workEvents) {
      bySource.set(e.source, (bySource.get(e.source) || 0) + 1);
    }
    for (const [source, count] of bySource) {
      prompt += `📋 ${count} événements depuis ${source}\n`;
    }
  }

  prompt += `\n== INSTRUCTIONS ==
COMBINE les données de communication ET de travail pour identifier les process complets.
Un process = communication (coordination) + travail (exécution).
Exemple : "Le commercial envoie un email au client (communication), puis crée une tâche dans Notion (travail), le dev la prend en charge (travail), le commercial notifie le client (communication)."
`;

  return prompt;
}
