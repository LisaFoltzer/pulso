export type TimelineEvent = {
  id: string;
  timestamp: string;
  from: string;
  fromRole: string;
  to: string;
  toRole: string;
  subject: string;
  snippet: string;
  source: "outlook" | "teams" | "aircall";
  process: string;
  actionType: string;
};

export const timelineEvents: TimelineEvent[] = [
  // Aujourd'hui
  { id: "t1", timestamp: "2026-04-03T09:12:00", from: "Sophie M.", fromRole: "Account Executive", to: "Julie R.", toRole: "CSM Lead", subject: "Nouveau client signé — TechnoVert SAS", snippet: "On vient de signer TechnoVert, 45 licences. Je te fais le handoff.", source: "outlook", process: "Onboarding Client", actionType: "handoff" },
  { id: "t2", timestamp: "2026-04-03T09:45:00", from: "Julie R.", fromRole: "CSM Lead", to: "Marc D.", toRole: "Solutions Engineer", subject: "Canal: #onboarding", snippet: "Marc, tu peux préparer l'environnement de test pour 45 users ?", source: "teams", process: "Onboarding Client", actionType: "demande" },
  { id: "t3", timestamp: "2026-04-03T10:30:00", from: "Client MediSoft", fromRole: "Client", to: "Emma L.", toRole: "Support N1", subject: "Appel entrant — problème connexion", snippet: "Erreur 403 quand il essaie d'accéder au dashboard depuis ce matin.", source: "aircall", process: "Support Technique", actionType: "demande" },
  { id: "t4", timestamp: "2026-04-03T10:48:00", from: "Emma L.", fromRole: "Support N1", to: "Nicolas F.", toRole: "Support N2", subject: "Canal: #support-escalation", snippet: "Escalade : MediSoft erreur 403 persistante. Ça ressemble au bug multi-tenant.", source: "teams", process: "Support Technique", actionType: "escalade" },
  { id: "t5", timestamp: "2026-04-03T11:00:00", from: "Thomas P.", fromRole: "Sales Rep", to: "Léa B.", toRole: "Sales Admin", subject: "Commande #4521 — DataFlow Corp", snippet: "Nouvelle commande, 120 unités pack Pro. Le client veut livraison avant le 15.", source: "outlook", process: "Traitement Commande", actionType: "demande" },
  { id: "t6", timestamp: "2026-04-03T11:30:00", from: "Léa B.", fromRole: "Sales Admin", to: "Antoine R.", toRole: "Comptable", subject: "Validation paiement — Commande #4521", snippet: "Merci de valider le paiement. Montant : 14 400€ HT. Conditions : 30 jours.", source: "outlook", process: "Traitement Commande", actionType: "demande" },
  { id: "t7", timestamp: "2026-04-03T13:10:00", from: "Nicolas F.", fromRole: "Support N2", to: "Emma L.", toRole: "Support N1", subject: "Canal: #support-escalation", snippet: "Trouvé — c'est le bug multi-tenant. Le fix n'a pas été déployé en prod. Hotfix en 30 min.", source: "teams", process: "Support Technique", actionType: "information" },
  { id: "t8", timestamp: "2026-04-03T14:00:00", from: "Julie R.", fromRole: "CSM Lead", to: "Client TechnoVert", toRole: "DG", subject: "Appel — Kick-off onboarding", snippet: "Présentation de l'équipe, planning d'onboarding sur 5 jours.", source: "aircall", process: "Onboarding Client", actionType: "livraison" },
  { id: "t9", timestamp: "2026-04-03T14:20:00", from: "Antoine R.", fromRole: "Comptable", to: "Léa B.", toRole: "Sales Admin", subject: "Canal: #commandes", snippet: "Paiement validé pour #4521. L'encours client est OK.", source: "teams", process: "Traitement Commande", actionType: "approbation" },
  { id: "t10", timestamp: "2026-04-03T15:00:00", from: "Marie G.", fromRole: "Billing Specialist", to: "François L.", toRole: "CFO", subject: "Canal: #finance", snippet: "Factures du mois prêtes. Total : 287K€. 3 factures au-dessus de 10K€ nécessitent ta validation.", source: "teams", process: "Facturation Mensuelle", actionType: "demande" },
  { id: "t11", timestamp: "2026-04-03T15:45:00", from: "Nicolas F.", fromRole: "Support N2", to: "Camille D.", toRole: "Product Manager", subject: "Canal: #product-bugs", snippet: "Bug report : fix multi-tenant du sprint 42 jamais déployé en prod. 3 clients impactés.", source: "teams", process: "Support Technique", actionType: "escalade" },
  { id: "t12", timestamp: "2026-04-03T16:30:00", from: "Emma L.", fromRole: "Support N1", to: "Client MediSoft", toRole: "Client", subject: "Résolution — Erreur 403 corrigée", snippet: "Le problème de connexion a été résolu. Vous pouvez accéder au dashboard normalement.", source: "outlook", process: "Support Technique", actionType: "livraison" },
  // Hier
  { id: "t13", timestamp: "2026-04-02T09:00:00", from: "Julie R.", fromRole: "CSM Lead", to: "Marie G.", toRole: "Billing Specialist", subject: "Données usage mars — tous clients", snippet: "Voici le récap d'usage pour la facturation. 3 clients ont dépassé leur quota.", source: "outlook", process: "Facturation Mensuelle", actionType: "information" },
  { id: "t14", timestamp: "2026-04-02T10:30:00", from: "Hugo L.", fromRole: "Resp. Logistique", to: "Client DataFlow", toRole: "Client", subject: "Expédition commande #4520", snippet: "Votre commande a été expédiée. Numéro de suivi : FR-2026-78451.", source: "outlook", process: "Traitement Commande", actionType: "livraison" },
  { id: "t15", timestamp: "2026-04-02T14:00:00", from: "Marc D.", fromRole: "Solutions Engineer", to: "Julie R.", toRole: "CSM Lead", subject: "Env de test prêt — NovaCorp", snippet: "Tenant de test configuré. Les 3 admins ont leurs accès. Formation possible demain.", source: "teams", process: "Onboarding Client", actionType: "information" },
  { id: "t16", timestamp: "2026-04-02T16:30:00", from: "François L.", fromRole: "CFO", to: "Marie G.", toRole: "Billing Specialist", subject: "Canal: #finance", snippet: "Factures validées. Par contre, celle de NexGen me semble haute — vérifie avec Julie.", source: "teams", process: "Facturation Mensuelle", actionType: "approbation" },
];

export const allProcesses = [
  "Onboarding Client",
  "Traitement Commande",
  "Support Technique",
  "Facturation Mensuelle",
];

export const allSources = ["outlook", "teams", "aircall"] as const;
