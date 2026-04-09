// Sources de données simulées (Outlook, Teams, Aircall)
export type Source = "outlook" | "teams" | "aircall";

export type ProcessNode = {
  id: string;
  label: string;
  role: string;
  department: string;
  x: number;
  y: number;
};

export type ProcessEdge = {
  id: string;
  from: string;
  to: string;
  source: Source;
  label: string;
  volume: number;
  avgTimeHours?: number; // measured avg time for this step
  type?: "handoff" | "demande" | "validation" | "escalade" | "livraison" | "information";
  stepOrder?: number; // order in the process sequence
};

export type DetectedProcess = {
  id: string;
  name: string;
  description: string;
  score: number;
  status: "healthy" | "warning" | "critical";
  steps: number;
  avgDuration: string;
  sources: Source[];
  nodes: ProcessNode[];
  edges: ProcessEdge[];
};

export const sourceConfig: Record<Source, { label: string; color: string; icon: string }> = {
  outlook: { label: "Outlook", color: "#0078D4", icon: "OL" },
  teams: { label: "Teams", color: "#6264A7", icon: "TM" },
  aircall: { label: "Aircall", color: "#00B388", icon: "AC" },
};

export const detectedProcesses: DetectedProcess[] = [
  {
    id: "onboarding-client",
    name: "Onboarding Client",
    description: "Process d'accueil et d'intégration des nouveaux clients, de la signature au premier usage produit.",
    score: 92,
    status: "healthy",
    steps: 6,
    avgDuration: "4.2 jours",
    sources: ["outlook", "teams", "aircall"],
    nodes: [
      { id: "commercial", label: "Commercial", role: "Account Executive", department: "Sales", x: 80, y: 200 },
      { id: "csm", label: "CSM", role: "Customer Success Manager", department: "CS", x: 280, y: 120 },
      { id: "tech", label: "Tech Lead", role: "Solutions Engineer", department: "Tech", x: 280, y: 320 },
      { id: "ops", label: "Ops", role: "Operations Manager", department: "Ops", x: 480, y: 200 },
      { id: "training", label: "Formation", role: "Training Specialist", department: "CS", x: 580, y: 320 },
      { id: "manager", label: "Manager", role: "Head of CS", department: "CS", x: 480, y: 60 },
      { id: "client", label: "Client", role: "Nouveau client", department: "Externe", x: 720, y: 200 },
    ],
    edges: [
      { id: "e1", from: "commercial", to: "csm", source: "outlook", label: "Handoff client", volume: 45, avgTimeHours: 2.1, type: "handoff", stepOrder: 1 },
      { id: "e2", from: "commercial", to: "tech", source: "teams", label: "Brief technique", volume: 32, avgTimeHours: 4.5, type: "demande", stepOrder: 1 },
      { id: "e3", from: "csm", to: "manager", source: "teams", label: "Validation budget", volume: 20, avgTimeHours: 8.2, type: "validation", stepOrder: 2 },
      { id: "e4", from: "csm", to: "ops", source: "teams", label: "Setup compte", volume: 38, avgTimeHours: 12, type: "demande", stepOrder: 3 },
      { id: "e5", from: "tech", to: "ops", source: "outlook", label: "Config technique", volume: 28, avgTimeHours: 18, type: "information", stepOrder: 3 },
      { id: "e6", from: "ops", to: "training", source: "teams", label: "Env prêt → formation", volume: 25, avgTimeHours: 4, type: "handoff", stepOrder: 4 },
      { id: "e7", from: "training", to: "client", source: "aircall", label: "Session formation", volume: 30, avgTimeHours: 24, type: "livraison", stepOrder: 5 },
      { id: "e8", from: "csm", to: "client", source: "aircall", label: "Appel bienvenue", volume: 40, avgTimeHours: 1, type: "livraison", stepOrder: 2 },
      { id: "e9", from: "ops", to: "client", source: "outlook", label: "Accès envoyés", volume: 42, avgTimeHours: 0.5, type: "livraison", stepOrder: 4 },
    ],
  },
  {
    id: "traitement-commandes",
    name: "Traitement Commandes",
    description: "Réception, validation et expédition des commandes clients. Détecté via les échanges entre ventes, logistique et finance.",
    score: 78,
    status: "warning",
    steps: 5,
    avgDuration: "2.8 jours",
    sources: ["outlook", "teams"],
    nodes: [
      { id: "sales", label: "Ventes", role: "Sales Rep", department: "Sales", x: 80, y: 200 },
      { id: "admin", label: "Admin", role: "Sales Admin", department: "Sales", x: 280, y: 120 },
      { id: "finance", label: "Finance", role: "Comptabilité", department: "Finance", x: 280, y: 280 },
      { id: "logistique", label: "Logistique", role: "Warehouse", department: "Ops", x: 480, y: 200 },
      { id: "client2", label: "Client", role: "Client final", department: "Externe", x: 680, y: 200 },
    ],
    edges: [
      { id: "e1", from: "sales", to: "admin", source: "outlook", label: "Bon de commande", volume: 120 },
      { id: "e2", from: "admin", to: "finance", source: "outlook", label: "Validation paiement", volume: 115 },
      { id: "e3", from: "admin", to: "logistique", source: "teams", label: "Ordre expédition", volume: 110 },
      { id: "e4", from: "finance", to: "logistique", source: "outlook", label: "Confirmation paiement", volume: 108 },
      { id: "e5", from: "logistique", to: "client2", source: "outlook", label: "Tracking expédition", volume: 105 },
    ],
  },
  {
    id: "support-n1",
    name: "Support Technique N1",
    description: "Traitement des demandes de support client de premier niveau. Escalade vers N2 si nécessaire.",
    score: 85,
    status: "healthy",
    steps: 4,
    avgDuration: "1.5 jours",
    sources: ["aircall", "teams", "outlook"],
    nodes: [
      { id: "client3", label: "Client", role: "Utilisateur", department: "Externe", x: 80, y: 200 },
      { id: "support1", label: "Support N1", role: "Agent Support", department: "Support", x: 280, y: 200 },
      { id: "support2", label: "Support N2", role: "Senior Support", department: "Support", x: 480, y: 120 },
      { id: "product", label: "Product", role: "Product Manager", department: "Product", x: 480, y: 280 },
    ],
    edges: [
      { id: "e1", from: "client3", to: "support1", source: "aircall", label: "Appel entrant", volume: 200 },
      { id: "e2", from: "support1", to: "client3", source: "outlook", label: "Résolution email", volume: 160 },
      { id: "e3", from: "support1", to: "support2", source: "teams", label: "Escalade N2", volume: 40 },
      { id: "e4", from: "support1", to: "product", source: "teams", label: "Bug report", volume: 25 },
    ],
  },
  {
    id: "facturation",
    name: "Facturation Mensuelle",
    description: "Cycle complet de facturation : génération, validation, envoi et suivi des paiements.",
    score: 64,
    status: "critical",
    steps: 5,
    avgDuration: "6.1 jours",
    sources: ["outlook", "teams"],
    nodes: [
      { id: "csm2", label: "CSM", role: "Customer Success", department: "CS", x: 80, y: 200 },
      { id: "billing", label: "Billing", role: "Billing Specialist", department: "Finance", x: 280, y: 120 },
      { id: "cfo", label: "CFO", role: "Directeur Financier", department: "Finance", x: 280, y: 280 },
      { id: "accounting", label: "Compta", role: "Comptable", department: "Finance", x: 480, y: 200 },
      { id: "client4", label: "Client", role: "Client", department: "Externe", x: 680, y: 200 },
    ],
    edges: [
      { id: "e1", from: "csm2", to: "billing", source: "outlook", label: "Données usage", volume: 50 },
      { id: "e2", from: "billing", to: "cfo", source: "teams", label: "Validation montants", volume: 48 },
      { id: "e3", from: "cfo", to: "accounting", source: "outlook", label: "Approbation", volume: 45 },
      { id: "e4", from: "accounting", to: "client4", source: "outlook", label: "Envoi facture", volume: 44 },
      { id: "e5", from: "client4", to: "accounting", source: "outlook", label: "Paiement reçu", volume: 38 },
    ],
  },
  {
    id: "livraison-express",
    name: "Livraison Express",
    description: "Gestion des livraisons prioritaires avec suivi en temps réel et coordination transporteur.",
    score: 88,
    status: "healthy",
    steps: 4,
    avgDuration: "0.8 jours",
    sources: ["teams", "aircall"],
    nodes: [
      { id: "dispatcher", label: "Dispatcher", role: "Coordinateur", department: "Ops", x: 80, y: 200 },
      { id: "warehouse", label: "Entrepôt", role: "Préparateur", department: "Ops", x: 280, y: 120 },
      { id: "transport", label: "Transport", role: "Chauffeur", department: "Externe", x: 280, y: 280 },
      { id: "client5", label: "Client", role: "Destinataire", department: "Externe", x: 480, y: 200 },
    ],
    edges: [
      { id: "e1", from: "dispatcher", to: "warehouse", source: "teams", label: "Ordre prépa", volume: 75 },
      { id: "e2", from: "warehouse", to: "transport", source: "teams", label: "Colis prêt", volume: 72 },
      { id: "e3", from: "transport", to: "client5", source: "aircall", label: "Appel livraison", volume: 68 },
      { id: "e4", from: "dispatcher", to: "client5", source: "teams", label: "Notification suivi", volume: 70 },
    ],
  },
];
