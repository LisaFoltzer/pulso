// Process Pattern Library — Option A (JSON)
// Used by Claude during analysis to detect known process types
// Will migrate to Option B (pgvector) when Supabase is set up
//
// Structure:
// - sectors: industry templates with typical processes
// - Each process has: detection signals, typical steps, roles, KPIs
// - customVocabulary: per-company learned terms (filled by user corrections)

export type Benchmark = {
  metric: string;
  unit: string;
  topQuartile: number;    // top 25% companies
  median: number;         // average
  bottomQuartile: number; // bottom 25%
  source: string;         // where this data comes from
};

export type ProcessPattern = {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  keywords: string[];
  typicalSteps: { order: number; name: string; role: string }[];
  typicalRoles: string[];
  typicalFlows: { from: string; to: string; type: string }[];
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "ad-hoc";
  avgDuration: string;
  redFlags: string[];
  kpis: string[];
  benchmarks: Benchmark[]; // industry benchmarks for this process
};

export type SectorProfile = {
  id: string;
  name: string;
  description: string;
  processes: ProcessPattern[];
};

export type CompanyVocabulary = {
  term: string;
  meaning: string;
  learnedFrom: "onboarding" | "correction" | "manual";
};

// ══════════════════════════════════════════════
// SECTOR TEMPLATES
// ══════════════════════════════════════════════

export const sectorProfiles: SectorProfile[] = [
  {
    id: "ecommerce",
    name: "E-commerce / DTC",
    description: "Vente directe au consommateur, marques en ligne",
    processes: [
      {
        id: "order-fulfillment",
        name: "Traitement des commandes",
        aliases: ["order processing", "fulfillment", "gestion commandes", "expédition"],
        description: "De la réception de la commande à la livraison au client",
        keywords: ["commande", "order", "livraison", "tracking", "expédition", "colis", "shipping", "fulfillment", "bon de commande", "préparation"],
        typicalSteps: [
          { order: 1, name: "Réception commande", role: "Système / E-commerce Manager" },
          { order: 2, name: "Validation paiement", role: "Finance / Système" },
          { order: 3, name: "Préparation commande", role: "Logistique / Warehouse" },
          { order: 4, name: "Expédition", role: "Logistique / Transporteur" },
          { order: 5, name: "Notification tracking", role: "Système / Service Client" },
          { order: 6, name: "Livraison", role: "Transporteur" },
        ],
        typicalRoles: ["E-commerce Manager", "Logistique", "Finance", "Service Client", "Transporteur"],
        typicalFlows: [
          { from: "E-commerce Manager", to: "Logistique", type: "demande" },
          { from: "Finance", to: "Logistique", type: "validation" },
          { from: "Logistique", to: "Transporteur", type: "handoff" },
          { from: "Service Client", to: "Client", type: "notification" },
        ],
        frequency: "daily",
        avgDuration: "1-3 jours",
        redFlags: ["délai expédition > 48h", "taux erreur préparation > 2%", "tracking non envoyé", "commande bloquée en validation"],
        kpis: ["Délai moyen expédition", "Taux de livraison à temps", "Taux d'erreur préparation"],
        benchmarks: [
          { metric: "Délai expédition", unit: "heures", topQuartile: 4, median: 18, bottomQuartile: 48, source: "Benchmark PME e-commerce 2025" },
          { metric: "Taux livraison à temps", unit: "%", topQuartile: 98, median: 92, bottomQuartile: 82, source: "Benchmark PME e-commerce 2025" },
          { metric: "Taux erreur préparation", unit: "%", topQuartile: 0.5, median: 2, bottomQuartile: 5, source: "Benchmark PME e-commerce 2025" },
          { metric: "Coût traitement par commande", unit: "€", topQuartile: 1.5, median: 3.5, bottomQuartile: 7, source: "Estimation sectorielle" },
        ],
      },
      {
        id: "returns",
        name: "Gestion des retours",
        aliases: ["retours", "returns", "remboursements", "SAV retour", "RMA"],
        description: "Traitement des retours produits et remboursements",
        keywords: ["retour", "return", "remboursement", "refund", "échange", "exchange", "RMA", "étiquette retour", "avoir"],
        typicalSteps: [
          { order: 1, name: "Demande de retour", role: "Client / Service Client" },
          { order: 2, name: "Validation motif", role: "Service Client" },
          { order: 3, name: "Envoi étiquette retour", role: "Logistique" },
          { order: 4, name: "Réception & inspection", role: "Warehouse" },
          { order: 5, name: "Remboursement / échange", role: "Finance" },
        ],
        typicalRoles: ["Service Client", "Logistique", "Warehouse", "Finance"],
        typicalFlows: [
          { from: "Service Client", to: "Logistique", type: "demande" },
          { from: "Warehouse", to: "Finance", type: "validation" },
          { from: "Finance", to: "Client", type: "livraison" },
        ],
        frequency: "daily",
        avgDuration: "5-10 jours",
        redFlags: ["délai remboursement > 7 jours", "taux retour > 15%", "motifs récurrents non traités"],
        kpis: ["Taux de retour", "Délai moyen remboursement", "Satisfaction post-retour"],
        benchmarks: [
          { metric: "Taux de retour", unit: "%", topQuartile: 3, median: 8, bottomQuartile: 18, source: "Benchmark DTC 2025" },
          { metric: "Délai remboursement", unit: "jours", topQuartile: 2, median: 5, bottomQuartile: 12, source: "Benchmark DTC 2025" },
          { metric: "CSAT post-retour", unit: "/10", topQuartile: 8.5, median: 7, bottomQuartile: 5, source: "Estimation sectorielle" },
        ],
      },
      {
        id: "supplier-management",
        name: "Gestion fournisseurs & approvisionnement",
        aliases: ["supply chain", "approvisionnement", "achat", "purchasing", "réappro", "stock"],
        description: "Commandes fournisseurs, suivi livraisons, gestion des stocks",
        keywords: ["fournisseur", "supplier", "stock", "réappro", "purchase order", "PO", "MOQ", "lead time", "inventory", "rupture"],
        typicalSteps: [
          { order: 1, name: "Détection besoin (seuil stock)", role: "Ops / Système" },
          { order: 2, name: "Commande fournisseur", role: "Achats" },
          { order: 3, name: "Suivi production / livraison", role: "Achats / Fournisseur" },
          { order: 4, name: "Réception marchandise", role: "Warehouse" },
          { order: 5, name: "Contrôle qualité", role: "Qualité / Ops" },
          { order: 6, name: "Mise en stock", role: "Warehouse" },
        ],
        typicalRoles: ["Achats", "Ops Manager", "Warehouse", "Fournisseur", "Qualité"],
        typicalFlows: [
          { from: "Ops Manager", to: "Achats", type: "demande" },
          { from: "Achats", to: "Fournisseur", type: "demande" },
          { from: "Fournisseur", to: "Warehouse", type: "livraison" },
          { from: "Warehouse", to: "Ops Manager", type: "information" },
        ],
        frequency: "weekly",
        avgDuration: "2-8 semaines",
        redFlags: ["rupture de stock", "retard fournisseur > 5 jours", "qualité non conforme > 3%"],
        kpis: ["Taux de rupture", "Délai moyen fournisseur", "Taux conformité qualité"],
        benchmarks: [
          { metric: "Taux de rupture stock", unit: "%", topQuartile: 1, median: 4, bottomQuartile: 12, source: "Benchmark supply chain PME 2025" },
          { metric: "Délai fournisseur", unit: "jours", topQuartile: 7, median: 21, bottomQuartile: 45, source: "Benchmark supply chain PME 2025" },
          { metric: "Taux conformité qualité", unit: "%", topQuartile: 99, median: 95, bottomQuartile: 88, source: "Estimation sectorielle" },
        ],
      },
      {
        id: "customer-support",
        name: "Support client",
        aliases: ["SAV", "service client", "customer service", "helpdesk", "ticket support"],
        description: "Traitement des demandes et réclamations clients",
        keywords: ["ticket", "réclamation", "problème", "support", "SAV", "aide", "bug", "plainte", "résolution"],
        typicalSteps: [
          { order: 1, name: "Réception demande", role: "Service Client N1" },
          { order: 2, name: "Qualification & triage", role: "Service Client N1" },
          { order: 3, name: "Résolution ou escalade", role: "Service Client N1 / N2" },
          { order: 4, name: "Suivi & résolution", role: "Service Client N2 / Tech" },
          { order: 5, name: "Clôture & feedback", role: "Service Client" },
        ],
        typicalRoles: ["Service Client N1", "Service Client N2", "Tech Support", "Product"],
        typicalFlows: [
          { from: "Client", to: "Service Client N1", type: "demande" },
          { from: "Service Client N1", to: "Service Client N2", type: "escalade" },
          { from: "Service Client N2", to: "Product", type: "escalade" },
          { from: "Service Client N1", to: "Client", type: "livraison" },
        ],
        frequency: "daily",
        avgDuration: "1-48 heures",
        redFlags: ["temps résolution > 24h", "taux escalade > 30%", "même problème remonté 3+ fois"],
        kpis: ["Temps moyen résolution", "Taux résolution N1", "CSAT"],
        benchmarks: [
          { metric: "Temps moyen résolution", unit: "heures", topQuartile: 2, median: 8, bottomQuartile: 24, source: "Benchmark support PME 2025" },
          { metric: "Taux résolution N1", unit: "%", topQuartile: 85, median: 70, bottomQuartile: 50, source: "Benchmark support PME 2025" },
          { metric: "CSAT", unit: "/10", topQuartile: 9, median: 7.5, bottomQuartile: 6, source: "Benchmark support PME 2025" },
          { metric: "Taux escalade", unit: "%", topQuartile: 10, median: 25, bottomQuartile: 40, source: "Estimation sectorielle" },
        ],
      },
      {
        id: "marketing-campaigns",
        name: "Campagnes marketing",
        aliases: ["marketing", "ads", "publicité", "campagne", "Meta Ads", "Google Ads", "newsletter"],
        description: "Planification, exécution et suivi des campagnes marketing",
        keywords: ["campagne", "ads", "publicité", "Meta", "Google", "newsletter", "email marketing", "landing page", "conversion", "ROI", "budget", "créatif"],
        typicalSteps: [
          { order: 1, name: "Brief & planification", role: "Marketing Manager" },
          { order: 2, name: "Création des assets", role: "Designer / Content" },
          { order: 3, name: "Validation", role: "Marketing Manager / Direction" },
          { order: 4, name: "Mise en ligne", role: "Marketing / Média Buyer" },
          { order: 5, name: "Suivi performance", role: "Marketing / Data" },
          { order: 6, name: "Optimisation", role: "Média Buyer" },
        ],
        typicalRoles: ["Marketing Manager", "Designer", "Média Buyer", "Data Analyst", "Direction"],
        typicalFlows: [
          { from: "Marketing Manager", to: "Designer", type: "demande" },
          { from: "Designer", to: "Marketing Manager", type: "livraison" },
          { from: "Marketing Manager", to: "Direction", type: "validation" },
          { from: "Média Buyer", to: "Marketing Manager", type: "information" },
        ],
        frequency: "weekly",
        avgDuration: "3-14 jours",
        redFlags: ["validation > 3 jours", "pas de suivi performance", "budget non trackée"],
        kpis: ["ROAS", "CPA", "Taux de conversion", "Délai brief-to-live"],
        benchmarks: [
          { metric: "Délai brief-to-live", unit: "jours", topQuartile: 2, median: 7, bottomQuartile: 14, source: "Benchmark marketing digital 2025" },
          { metric: "ROAS moyen", unit: "x", topQuartile: 5, median: 3, bottomQuartile: 1.5, source: "Benchmark Meta/Google Ads 2025" },
          { metric: "Taux validation créatifs", unit: "jours", topQuartile: 0.5, median: 2, bottomQuartile: 5, source: "Estimation sectorielle" },
        ],
      },
      {
        id: "billing",
        name: "Facturation",
        aliases: ["facturation", "billing", "invoicing", "comptabilité", "paiements"],
        description: "Émission des factures, suivi des paiements, relances",
        keywords: ["facture", "invoice", "paiement", "payment", "relance", "avoir", "échéance", "encaissement", "trésorerie"],
        typicalSteps: [
          { order: 1, name: "Collecte données (usage/prestations)", role: "Ops / Account Manager" },
          { order: 2, name: "Génération facture", role: "Billing / Comptabilité" },
          { order: 3, name: "Validation", role: "Finance / Direction" },
          { order: 4, name: "Envoi au client", role: "Billing" },
          { order: 5, name: "Suivi paiement & relance", role: "Billing / Comptabilité" },
        ],
        typicalRoles: ["Account Manager", "Billing", "Comptabilité", "Direction Financière"],
        typicalFlows: [
          { from: "Account Manager", to: "Billing", type: "information" },
          { from: "Billing", to: "Direction Financière", type: "validation" },
          { from: "Billing", to: "Client", type: "livraison" },
        ],
        frequency: "monthly",
        avgDuration: "3-7 jours",
        redFlags: ["cycle > 5 jours", "validation bloquée > 2 jours", "retard paiement > 30 jours", "factures manuelles"],
        kpis: ["Délai moyen cycle facturation", "Taux de paiement à temps", "DSO"],
        benchmarks: [
          { metric: "Cycle facturation complet", unit: "jours", topQuartile: 1, median: 3, bottomQuartile: 7, source: "Benchmark finance PME 2025" },
          { metric: "Taux paiement à temps", unit: "%", topQuartile: 95, median: 82, bottomQuartile: 65, source: "Benchmark finance PME 2025" },
          { metric: "DSO (jours de crédit client)", unit: "jours", topQuartile: 25, median: 42, bottomQuartile: 65, source: "Benchmark finance PME 2025" },
          { metric: "Taux automatisation facturation", unit: "%", topQuartile: 90, median: 50, bottomQuartile: 10, source: "Estimation sectorielle" },
        ],
      },
    ],
  },
  {
    id: "saas",
    name: "SaaS / Tech",
    description: "Entreprises de logiciel, abonnement",
    processes: [
      {
        id: "client-onboarding",
        name: "Onboarding client",
        aliases: ["onboarding", "intégration client", "setup client", "activation"],
        description: "Accueil et mise en route des nouveaux clients",
        keywords: ["onboarding", "setup", "activation", "kick-off", "formation", "training", "migration", "go-live", "bienvenue"],
        typicalSteps: [
          { order: 1, name: "Handoff Sales → CS", role: "Account Executive → CSM" },
          { order: 2, name: "Kick-off client", role: "CSM" },
          { order: 3, name: "Configuration technique", role: "Solutions Engineer" },
          { order: 4, name: "Migration données", role: "Tech / Client" },
          { order: 5, name: "Formation", role: "CSM / Training" },
          { order: 6, name: "Go-live", role: "CSM / Client" },
        ],
        typicalRoles: ["Account Executive", "CSM", "Solutions Engineer", "Training", "Client"],
        typicalFlows: [
          { from: "Account Executive", to: "CSM", type: "handoff" },
          { from: "CSM", to: "Solutions Engineer", type: "demande" },
          { from: "CSM", to: "Client", type: "livraison" },
        ],
        frequency: "ad-hoc",
        avgDuration: "1-4 semaines",
        redFlags: ["onboarding > 30 jours", "pas de kick-off dans les 5 jours", "client inactif après go-live"],
        kpis: ["Time to value", "Activation rate", "Délai onboarding"],
        benchmarks: [
          { metric: "Time to value", unit: "jours", topQuartile: 3, median: 14, bottomQuartile: 30, source: "Benchmark SaaS B2B 2025" },
          { metric: "Activation rate", unit: "%", topQuartile: 90, median: 65, bottomQuartile: 40, source: "Benchmark SaaS B2B 2025" },
          { metric: "Délai kick-off après signature", unit: "jours", topQuartile: 1, median: 5, bottomQuartile: 14, source: "Benchmark SaaS B2B 2025" },
        ],
      },
      {
        id: "bug-resolution",
        name: "Résolution de bugs",
        aliases: ["bug fix", "incident", "hotfix", "debug", "issue resolution"],
        description: "Détection, triage et correction des bugs",
        keywords: ["bug", "fix", "hotfix", "incident", "erreur", "crash", "regression", "deploy", "patch"],
        typicalSteps: [
          { order: 1, name: "Signalement", role: "Client / Support / QA" },
          { order: 2, name: "Triage & priorité", role: "Product / Tech Lead" },
          { order: 3, name: "Développement fix", role: "Développeur" },
          { order: 4, name: "Code review", role: "Tech Lead" },
          { order: 5, name: "Déploiement", role: "DevOps / Développeur" },
          { order: 6, name: "Vérification & notification", role: "QA / Support" },
        ],
        typicalRoles: ["Support", "Product Manager", "Tech Lead", "Développeur", "QA", "DevOps"],
        typicalFlows: [
          { from: "Support", to: "Product Manager", type: "escalade" },
          { from: "Product Manager", to: "Développeur", type: "demande" },
          { from: "Développeur", to: "Tech Lead", type: "validation" },
          { from: "DevOps", to: "Support", type: "information" },
        ],
        frequency: "daily",
        avgDuration: "1-72 heures",
        redFlags: ["même bug remonté 3+ fois", "fix en staging mais pas en prod", "pas de post-mortem"],
        kpis: ["Temps moyen résolution", "Taux de regression", "Bugs critiques ouverts"],
        benchmarks: [
          { metric: "Temps moyen résolution bug critique", unit: "heures", topQuartile: 2, median: 12, bottomQuartile: 48, source: "Benchmark SaaS 2025" },
          { metric: "Taux de regression", unit: "%", topQuartile: 2, median: 8, bottomQuartile: 20, source: "Benchmark SaaS 2025" },
          { metric: "Bugs critiques ouverts", unit: "nombre", topQuartile: 0, median: 2, bottomQuartile: 8, source: "Estimation sectorielle" },
        ],
      },
    ],
  },
  {
    id: "consulting",
    name: "Consulting / Agence",
    description: "Services, conseil, agences",
    processes: [
      {
        id: "project-delivery",
        name: "Delivery projet client",
        aliases: ["projet", "delivery", "mission", "prestation"],
        description: "Gestion d'un projet client de A à Z",
        keywords: ["projet", "mission", "livrable", "deadline", "milestone", "sprint", "delivery", "brief", "specs", "recette"],
        typicalSteps: [
          { order: 1, name: "Brief & cadrage", role: "Account / Chef de projet" },
          { order: 2, name: "Spécifications", role: "Chef de projet / Client" },
          { order: 3, name: "Production", role: "Équipe delivery" },
          { order: 4, name: "Revue interne", role: "Lead / Directeur" },
          { order: 5, name: "Livraison client", role: "Chef de projet" },
          { order: 6, name: "Recette & ajustements", role: "Client / Équipe" },
          { order: 7, name: "Clôture & facturation", role: "Chef de projet / Finance" },
        ],
        typicalRoles: ["Account Manager", "Chef de projet", "Équipe delivery", "Lead technique", "Client", "Finance"],
        typicalFlows: [
          { from: "Account Manager", to: "Chef de projet", type: "handoff" },
          { from: "Chef de projet", to: "Équipe delivery", type: "demande" },
          { from: "Équipe delivery", to: "Lead technique", type: "validation" },
          { from: "Chef de projet", to: "Client", type: "livraison" },
          { from: "Chef de projet", to: "Finance", type: "information" },
        ],
        frequency: "ad-hoc",
        avgDuration: "2-12 semaines",
        redFlags: ["scope creep non documenté", "client silencieux > 5 jours", "pas de suivi heures"],
        kpis: ["Marge projet", "Respect deadline", "Satisfaction client"],
        benchmarks: [
          { metric: "Marge projet", unit: "%", topQuartile: 40, median: 25, bottomQuartile: 10, source: "Benchmark consulting 2025" },
          { metric: "Respect deadline", unit: "%", topQuartile: 95, median: 75, bottomQuartile: 50, source: "Benchmark consulting 2025" },
          { metric: "Satisfaction client (NPS)", unit: "score", topQuartile: 70, median: 40, bottomQuartile: 10, source: "Estimation sectorielle" },
        ],
      },
      {
        id: "time-billing",
        name: "Suivi heures & facturation prestations",
        aliases: ["timesheet", "heures", "time tracking", "facturation prestation"],
        description: "Suivi du temps passé et facturation au client",
        keywords: ["heures", "timesheet", "time tracking", "facturation", "prestation", "TJM", "plafond", "récap"],
        typicalSteps: [
          { order: 1, name: "Saisie heures", role: "Consultant / Équipe" },
          { order: 2, name: "Validation manager", role: "Manager / Chef de projet" },
          { order: 3, name: "Consolidation", role: "Finance / Ops" },
          { order: 4, name: "Génération facture", role: "Finance" },
          { order: 5, name: "Envoi & suivi paiement", role: "Finance" },
        ],
        typicalRoles: ["Consultant", "Chef de projet", "Manager", "Finance"],
        typicalFlows: [
          { from: "Consultant", to: "Manager", type: "information" },
          { from: "Manager", to: "Finance", type: "validation" },
          { from: "Finance", to: "Client", type: "livraison" },
        ],
        frequency: "monthly",
        avgDuration: "3-7 jours",
        redFlags: ["heures non saisies > 3 jours", "facturation en retard > 10 jours", "dépassement plafond"],
        kpis: ["Taux de saisie heures", "Délai facturation", "Taux de recouvrement"],
        benchmarks: [
          { metric: "Taux de saisie heures à temps", unit: "%", topQuartile: 95, median: 75, bottomQuartile: 50, source: "Benchmark consulting 2025" },
          { metric: "Délai facturation après prestation", unit: "jours", topQuartile: 2, median: 7, bottomQuartile: 15, source: "Benchmark consulting 2025" },
          { metric: "Taux de recouvrement à 30j", unit: "%", topQuartile: 95, median: 80, bottomQuartile: 60, source: "Estimation sectorielle" },
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════
// COMPANY-SPECIFIC VOCABULARY (grows over time)
// ══════════════════════════════════════════════

let companyVocabulary: CompanyVocabulary[] = [];

export function addVocabulary(term: string, meaning: string, source: CompanyVocabulary["learnedFrom"]) {
  companyVocabulary.push({ term, meaning, learnedFrom: source });
  // Persist to localStorage
  try {
    localStorage.setItem("pulso_vocabulary", JSON.stringify(companyVocabulary));
  } catch { /* SSR */ }
}

export function loadVocabulary(): CompanyVocabulary[] {
  try {
    const raw = localStorage.getItem("pulso_vocabulary");
    if (raw) companyVocabulary = JSON.parse(raw);
  } catch { /* SSR */ }
  return companyVocabulary;
}

// ══════════════════════════════════════════════
// BUILD PROMPT CONTEXT FROM PATTERNS
// ══════════════════════════════════════════════

export function buildPatternContext(sectorId?: string): string {
  const sectors = sectorId
    ? sectorProfiles.filter((s) => s.id === sectorId)
    : sectorProfiles;

  const processTemplates = sectors.flatMap((s) =>
    s.processes.map((p) => `
### ${p.name} (${s.name})
Aussi connu comme : ${p.aliases.join(", ")}
Mots-clés à chercher : ${p.keywords.join(", ")}
Étapes typiques : ${p.typicalSteps.map((s) => `${s.order}. ${s.name} (${s.role})`).join(" → ")}
Rôles : ${p.typicalRoles.join(", ")}
Fréquence : ${p.frequency}
Durée typique : ${p.avgDuration}
Red flags : ${p.redFlags.join("; ")}`)
  ).join("\n");

  const vocabSection = companyVocabulary.length > 0
    ? `\n\nVOCABULAIRE SPÉCIFIQUE DE L'ENTREPRISE :\n${companyVocabulary.map((v) => `- "${v.term}" = ${v.meaning}`).join("\n")}`
    : "";

  return `BIBLIOTHÈQUE DE PATTERNS DE PROCESS :
Tu connais les process métier typiques suivants. Utilise-les comme RÉFÉRENCE pour détecter des patterns similaires dans les emails. Ne force pas un match — si les emails ne correspondent pas, détecte de nouveaux process.

${processTemplates}
${vocabSection}`;
}

// ══════════════════════════════════════════════
// BENCHMARK MATCHING
// ══════════════════════════════════════════════

// Find the best matching pattern for a detected process
export function findMatchingPattern(processName: string): ProcessPattern | null {
  const lower = processName.toLowerCase();
  for (const sector of sectorProfiles) {
    for (const pattern of sector.processes) {
      // Check name match
      if (lower.includes(pattern.name.toLowerCase().split(" ")[0])) return pattern;
      // Check aliases
      for (const alias of pattern.aliases) {
        if (lower.includes(alias.toLowerCase())) return pattern;
      }
      // Check keywords overlap
      const matchingKeywords = pattern.keywords.filter((k) => lower.includes(k.toLowerCase()));
      if (matchingKeywords.length >= 2) return pattern;
    }
  }
  return null;
}

// Get benchmarks for a detected process
export function getBenchmarksForProcess(processName: string): Benchmark[] {
  const pattern = findMatchingPattern(processName);
  return pattern?.benchmarks || [];
}

// Determine quartile position for a value
export function getQuartilePosition(value: number, benchmark: Benchmark, higherIsBetter: boolean): "top" | "median" | "bottom" {
  if (higherIsBetter) {
    if (value >= benchmark.topQuartile) return "top";
    if (value >= benchmark.median) return "median";
    return "bottom";
  } else {
    if (value <= benchmark.topQuartile) return "top";
    if (value <= benchmark.median) return "median";
    return "bottom";
  }
}

// Build benchmark context for Sparring Partner
export function buildBenchmarkContext(): string {
  const allBenchmarks = sectorProfiles.flatMap((s) =>
    s.processes.flatMap((p) =>
      p.benchmarks.map((b) => `${p.name} — ${b.metric}: Top 25% = ${b.topQuartile}${b.unit}, Médiane = ${b.median}${b.unit}, Bottom 25% = ${b.bottomQuartile}${b.unit} (${b.source})`)
    )
  );

  return `\n\nBENCHMARKS SECTORIELS (utilise-les pour contextualiser les performances) :\n${allBenchmarks.join("\n")}`;
}
