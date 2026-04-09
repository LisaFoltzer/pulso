// Automation Templates — Ready-to-deploy workflows
// Each template is linked to a process pattern and a specific bottleneck
// Can be deployed to n8n, Make, or Zapier

export type AutomationStep = {
  id: string;
  type: "trigger" | "condition" | "action" | "delay";
  label: string;
  description: string;
  icon: string;
  tool: string; // "gmail", "slack", "notion", "n8n", "webhook", etc.
  config?: Record<string, string>;
};

export type AutomationTemplate = {
  id: string;
  name: string;
  description: string;
  category: "notification" | "validation" | "routing" | "reporting" | "sync";
  processPattern: string; // linked to process_patterns.id
  bottleneck: string; // what problem it solves
  impact: {
    timeSaved: string;
    costSaved: string;
    effort: "low" | "medium" | "high";
    deployTime: string;
  };
  steps: AutomationStep[];
  tools: string[]; // required tools
  deployTarget: "n8n" | "make" | "zapier" | "custom";
};

export const automationTemplates: AutomationTemplate[] = [
  // ═══ FACTURATION ═══
  {
    id: "auto-invoice-validation",
    name: "Auto-validation factures < 5K€",
    description: "Les factures sous 5K€ sont automatiquement validées sans passer par le CFO. Le CFO reçoit un récap hebdomadaire.",
    category: "validation",
    processPattern: "ecom-billing",
    bottleneck: "Validation CFO bloque le cycle de facturation (1.5j de délai)",
    impact: {
      timeSaved: "~10h/mois",
      costSaved: "~1 500€/mois",
      effort: "low",
      deployTime: "30 min",
    },
    steps: [
      { id: "s1", type: "trigger", label: "Nouvelle facture générée", description: "Quand une facture est créée dans le système", icon: "", tool: "webhook" },
      { id: "s2", type: "condition", label: "Montant < 5 000€ ?", description: "Vérifier si la facture est sous le seuil", icon: "", tool: "n8n" },
      { id: "s3", type: "action", label: "Auto-valider", description: "Marquer la facture comme validée automatiquement", icon: "", tool: "webhook" },
      { id: "s4", type: "action", label: "Envoyer au client", description: "Envoyer la facture par email au client", icon: "", tool: "gmail" },
      { id: "s5", type: "action", label: "Notifier le CFO", description: "Ajouter au récap hebdomadaire du CFO", icon: "", tool: "slack" },
    ],
    tools: ["Gmail", "Slack", "Webhook"],
    deployTarget: "n8n",
  },
  {
    id: "invoice-reminder",
    name: "Relance automatique paiements en retard",
    description: "Envoie automatiquement un email de relance quand une facture n'est pas payée après 30 jours, puis 45 jours, puis 60 jours.",
    category: "notification",
    processPattern: "ecom-billing",
    bottleneck: "Retards de paiement non détectés à temps",
    impact: {
      timeSaved: "~5h/mois",
      costSaved: "~3 000€/mois (trésorerie)",
      effort: "low",
      deployTime: "20 min",
    },
    steps: [
      { id: "s1", type: "trigger", label: "Chaque jour à 9h", description: "Vérification quotidienne des factures impayées", icon: "", tool: "n8n" },
      { id: "s2", type: "condition", label: "Facture impayée > 30j ?", description: "Vérifier les factures en retard", icon: "", tool: "n8n" },
      { id: "s3", type: "action", label: "Email relance douce", description: "Envoyer un rappel poli au client", icon: "", tool: "gmail" },
      { id: "s4", type: "delay", label: "Attendre 15 jours", description: "Si toujours impayée après 15 jours", icon: "", tool: "n8n" },
      { id: "s5", type: "action", label: "Email relance ferme", description: "Deuxième relance avec mention de pénalités", icon: "", tool: "gmail" },
      { id: "s6", type: "action", label: "Alerter Finance", description: "Notifier l'équipe finance sur Slack", icon: "", tool: "slack" },
    ],
    tools: ["Gmail", "Slack"],
    deployTarget: "n8n",
  },

  // ═══ COMMANDES ═══
  {
    id: "auto-payment-validation",
    name: "Auto-validation paiement clients récurrents",
    description: "Les commandes de clients avec un historique fiable (>6 mois, 0 impayé) sont auto-validées. Élimine le goulot de validation Finance.",
    category: "validation",
    processPattern: "ecom-order-fulfillment",
    bottleneck: "Validation paiement ajoute 4.2h par commande",
    impact: {
      timeSaved: "~32h/mois",
      costSaved: "~4 800€/mois",
      effort: "medium",
      deployTime: "2h",
    },
    steps: [
      { id: "s1", type: "trigger", label: "Nouvelle commande reçue", description: "Quand un client passe commande", icon: "", tool: "webhook" },
      { id: "s2", type: "condition", label: "Client fiable ?", description: "Vérifier : >6 mois d'historique ET 0 impayé", icon: "", tool: "n8n" },
      { id: "s3", type: "action", label: "Auto-valider paiement", description: "Confirmer le paiement automatiquement", icon: "", tool: "webhook" },
      { id: "s4", type: "action", label: "Notifier logistique", description: "Envoyer l'ordre de préparation", icon: "", tool: "slack" },
      { id: "s5", type: "action", label: "Log pour audit", description: "Enregistrer la décision auto dans un log", icon: "", tool: "notion" },
    ],
    tools: ["Slack", "Notion", "Webhook"],
    deployTarget: "n8n",
  },
  {
    id: "order-tracking-notification",
    name: "Notification tracking automatique",
    description: "Envoie automatiquement le numéro de suivi au client dès que le colis est expédié.",
    category: "notification",
    processPattern: "ecom-order-fulfillment",
    bottleneck: "Tracking envoyé manuellement avec retard",
    impact: {
      timeSaved: "~8h/mois",
      costSaved: "~1 200€/mois",
      effort: "low",
      deployTime: "15 min",
    },
    steps: [
      { id: "s1", type: "trigger", label: "Statut → Expédié", description: "Quand le statut d'une commande passe à 'expédié'", icon: "", tool: "webhook" },
      { id: "s2", type: "action", label: "Email tracking", description: "Envoyer le numéro de suivi au client", icon: "", tool: "gmail" },
      { id: "s3", type: "action", label: "SMS optionnel", description: "Envoyer un SMS si le client a opté", icon: "", tool: "webhook" },
    ],
    tools: ["Gmail", "Webhook"],
    deployTarget: "n8n",
  },

  // ═══ SUPPORT ═══
  {
    id: "ticket-escalation-auto",
    name: "Escalade automatique tickets > 24h",
    description: "Si un ticket support n'est pas résolu en 24h, il est automatiquement escaladé au N2 avec notification au manager.",
    category: "routing",
    processPattern: "ecom-support",
    bottleneck: "Tickets oubliés ou traités trop tard",
    impact: {
      timeSaved: "~4h/mois",
      costSaved: "Satisfaction client +15%",
      effort: "low",
      deployTime: "30 min",
    },
    steps: [
      { id: "s1", type: "trigger", label: "Ticket ouvert > 24h", description: "Vérifier les tickets non résolus", icon: "", tool: "n8n" },
      { id: "s2", type: "action", label: "Assigner à N2", description: "Réassigner au support N2", icon: "", tool: "webhook" },
      { id: "s3", type: "action", label: "Notifier manager", description: "Alerter le responsable support", icon: "", tool: "slack" },
      { id: "s4", type: "action", label: "Notifier client", description: "Informer le client que son ticket est priorisé", icon: "", tool: "gmail" },
    ],
    tools: ["Slack", "Gmail", "Webhook"],
    deployTarget: "n8n",
  },

  // ═══ ONBOARDING ═══
  {
    id: "onboarding-checklist",
    name: "Checklist onboarding automatique",
    description: "Quand un nouveau client signe, une checklist Notion est créée et les tâches sont assignées automatiquement aux bonnes personnes.",
    category: "sync",
    processPattern: "saas-onboarding",
    bottleneck: "Étapes d'onboarding oubliées ou faites en retard",
    impact: {
      timeSaved: "~6h/mois",
      costSaved: "Activation +20%",
      effort: "medium",
      deployTime: "1h",
    },
    steps: [
      { id: "s1", type: "trigger", label: "Nouveau client signé", description: "Quand le deal est marqué 'Won' dans le CRM", icon: "", tool: "webhook" },
      { id: "s2", type: "action", label: "Créer checklist Notion", description: "Générer la checklist onboarding depuis le template", icon: "", tool: "notion" },
      { id: "s3", type: "action", label: "Assigner CSM", description: "Notifier le CSM assigné", icon: "", tool: "slack" },
      { id: "s4", type: "action", label: "Planifier kick-off", description: "Créer un événement calendrier pour le kick-off", icon: "", tool: "webhook" },
      { id: "s5", type: "action", label: "Email bienvenue", description: "Envoyer l'email de bienvenue au client", icon: "", tool: "gmail" },
    ],
    tools: ["Notion", "Slack", "Gmail"],
    deployTarget: "n8n",
  },

  // ═══ REPORTING ═══
  {
    id: "daily-digest",
    name: "Bilan quotidien automatique",
    description: "Chaque matin à 8h, un résumé des KPIs de la veille est envoyé au CEO sur Slack.",
    category: "reporting",
    processPattern: "ecom-billing",
    bottleneck: "Pas de visibilité quotidienne sur les opérations",
    impact: {
      timeSaved: "~3h/semaine",
      costSaved: "Décisions plus rapides",
      effort: "low",
      deployTime: "20 min",
    },
    steps: [
      { id: "s1", type: "trigger", label: "Chaque jour à 8h", description: "Déclenché automatiquement le matin", icon: "", tool: "n8n" },
      { id: "s2", type: "action", label: "Collecter KPIs", description: "Récupérer les chiffres de la veille", icon: "", tool: "webhook" },
      { id: "s3", type: "action", label: "Générer résumé", description: "Formater un message avec les KPIs clés", icon: "", tool: "n8n" },
      { id: "s4", type: "action", label: "Envoyer sur Slack", description: "Poster dans le canal #general ou #management", icon: "", tool: "slack" },
    ],
    tools: ["Slack", "Webhook"],
    deployTarget: "n8n",
  },
];

// Category config
export const categoryConfig: Record<string, { label: string; color: string }> = {
  notification: { label: "Notification", color: "#3B82F6" },
  validation: { label: "Validation auto", color: "#22C55E" },
  routing: { label: "Routage", color: "#8B5CF6" },
  reporting: { label: "Reporting", color: "#F59E0B" },
  sync: { label: "Synchronisation", color: "#06B6D4" },
};

export const effortConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Faible", color: "#22C55E" },
  medium: { label: "Moyen", color: "#EAB308" },
  high: { label: "Élevé", color: "#EF4444" },
};
