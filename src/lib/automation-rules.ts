// Automation Rules Engine
// Each automation has default rules that the client can customize
// Rules are per-sector with sensible defaults

export type RuleType = "threshold" | "duration" | "count" | "toggle" | "select";

export type AutomationRule = {
  id: string;
  label: string;
  description: string;
  type: RuleType;
  defaultValue: number | string | boolean;
  unit?: string;
  min?: number;
  max?: number;
  options?: { value: string; label: string }[]; // for "select" type
  sectorOverrides?: Record<string, number | string | boolean>; // different defaults per sector
};

export type AutomationWithRules = {
  automationId: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rules: AutomationRule[];
  trigger: string;
  actions: string[];
};

export const automationRules: AutomationWithRules[] = [
  // ═══ FACTURATION ═══
  {
    automationId: "auto-invoice-validation",
    name: "Auto-validation des factures",
    description: "Les factures sous un certain montant sont validées automatiquement",
    icon: "✅",
    category: "facturation",
    trigger: "Quand une nouvelle facture est générée",
    actions: ["Valider automatiquement", "Envoyer au client", "Notifier le CFO dans le récap"],
    rules: [
      {
        id: "threshold_amount",
        label: "Seuil de validation auto",
        description: "Les factures sous ce montant sont auto-validées",
        type: "threshold",
        defaultValue: 5000,
        unit: "€",
        min: 500,
        max: 50000,
        sectorOverrides: {
          ecommerce: 5000,
          saas: 10000,
          consulting: 3000,
        },
      },
      {
        id: "notify_cfo",
        label: "Notifier le CFO",
        description: "Le CFO reçoit un récapitulatif des factures auto-validées",
        type: "select",
        defaultValue: "weekly",
        options: [
          { value: "each", label: "À chaque facture" },
          { value: "daily", label: "Récap quotidien" },
          { value: "weekly", label: "Récap hebdomadaire" },
          { value: "never", label: "Jamais" },
        ],
      },
      {
        id: "require_po",
        label: "Bon de commande obligatoire",
        description: "Exiger un bon de commande pour auto-valider",
        type: "toggle",
        defaultValue: false,
      },
    ],
  },

  // ═══ RELANCE PAIEMENT ═══
  {
    automationId: "invoice-reminder",
    name: "Relance automatique paiements",
    description: "Envoie des relances automatiques quand une facture n'est pas payée",
    icon: "📧",
    category: "facturation",
    trigger: "Facture impayée après le délai configuré",
    actions: ["Email relance douce", "Email relance ferme", "Alerte équipe finance"],
    rules: [
      {
        id: "first_reminder_days",
        label: "1ère relance après",
        description: "Nombre de jours après échéance pour la première relance",
        type: "duration",
        defaultValue: 7,
        unit: "jours",
        min: 1,
        max: 90,
        sectorOverrides: {
          ecommerce: 7,
          saas: 14,
          consulting: 30,
        },
      },
      {
        id: "second_reminder_days",
        label: "2ème relance après",
        description: "Jours après la 1ère relance pour la deuxième",
        type: "duration",
        defaultValue: 15,
        unit: "jours",
        min: 5,
        max: 60,
      },
      {
        id: "alert_finance_days",
        label: "Alerte finance après",
        description: "Jours sans paiement avant d'alerter l'équipe finance",
        type: "duration",
        defaultValue: 45,
        unit: "jours",
        min: 15,
        max: 120,
      },
      {
        id: "reminder_tone",
        label: "Ton de la relance",
        description: "Style des emails de relance",
        type: "select",
        defaultValue: "friendly",
        options: [
          { value: "friendly", label: "Amical" },
          { value: "professional", label: "Professionnel" },
          { value: "firm", label: "Ferme" },
        ],
      },
      {
        id: "exclude_vip",
        label: "Exclure les clients VIP",
        description: "Ne pas envoyer de relances automatiques aux clients marqués VIP",
        type: "toggle",
        defaultValue: true,
      },
    ],
  },

  // ═══ VALIDATION COMMANDE ═══
  {
    automationId: "auto-payment-validation",
    name: "Auto-validation paiement commandes",
    description: "Les commandes de clients fiables sont validées automatiquement",
    icon: "🛒",
    category: "commandes",
    trigger: "Quand une nouvelle commande est reçue",
    actions: ["Vérifier la fiabilité client", "Auto-valider", "Notifier la logistique"],
    rules: [
      {
        id: "client_min_months",
        label: "Ancienneté minimum client",
        description: "Le client doit être client depuis au moins X mois",
        type: "duration",
        defaultValue: 6,
        unit: "mois",
        min: 1,
        max: 24,
      },
      {
        id: "max_unpaid",
        label: "Impayés tolérés",
        description: "Nombre maximum d'impayés pour rester éligible",
        type: "count",
        defaultValue: 0,
        unit: "impayés",
        min: 0,
        max: 3,
      },
      {
        id: "max_auto_amount",
        label: "Montant maximum auto-validé",
        description: "Au-dessus de ce montant, validation manuelle requise",
        type: "threshold",
        defaultValue: 10000,
        unit: "€",
        min: 1000,
        max: 100000,
        sectorOverrides: {
          ecommerce: 10000,
          saas: 50000,
          consulting: 5000,
        },
      },
      {
        id: "log_decisions",
        label: "Logger les décisions",
        description: "Enregistrer chaque auto-validation dans un log d'audit",
        type: "toggle",
        defaultValue: true,
      },
    ],
  },

  // ═══ TRACKING COMMANDE ═══
  {
    automationId: "order-tracking-notification",
    name: "Notification tracking automatique",
    description: "Envoie le numéro de suivi dès que le colis est expédié",
    icon: "📦",
    category: "commandes",
    trigger: "Quand le statut passe à 'Expédié'",
    actions: ["Email avec tracking", "SMS optionnel"],
    rules: [
      {
        id: "send_email",
        label: "Envoyer par email",
        description: "Notification par email au client",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "send_sms",
        label: "Envoyer par SMS",
        description: "Notification SMS en plus de l'email",
        type: "toggle",
        defaultValue: false,
      },
      {
        id: "delay_minutes",
        label: "Délai avant envoi",
        description: "Attendre X minutes après l'expédition (pour éviter les faux positifs)",
        type: "duration",
        defaultValue: 15,
        unit: "minutes",
        min: 0,
        max: 120,
      },
    ],
  },

  // ═══ ESCALADE SUPPORT ═══
  {
    automationId: "ticket-escalation-auto",
    name: "Escalade automatique tickets",
    description: "Escalade automatique si un ticket n'est pas résolu dans le délai",
    icon: "🚨",
    category: "support",
    trigger: "Ticket ouvert sans résolution après le délai",
    actions: ["Réassigner au N2", "Notifier le manager", "Informer le client"],
    rules: [
      {
        id: "escalation_hours",
        label: "Délai avant escalade",
        description: "Heures sans résolution avant escalade automatique",
        type: "duration",
        defaultValue: 24,
        unit: "heures",
        min: 1,
        max: 168,
        sectorOverrides: {
          ecommerce: 4,
          saas: 24,
          consulting: 48,
        },
      },
      {
        id: "notify_client",
        label: "Notifier le client",
        description: "Informer le client que son ticket a été priorisé",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "priority_filter",
        label: "Appliquer uniquement aux tickets",
        description: "Types de tickets concernés par l'escalade auto",
        type: "select",
        defaultValue: "all",
        options: [
          { value: "all", label: "Tous les tickets" },
          { value: "high", label: "Haute priorité uniquement" },
          { value: "high_medium", label: "Haute + Moyenne priorité" },
        ],
      },
    ],
  },

  // ═══ ONBOARDING ═══
  {
    automationId: "onboarding-checklist",
    name: "Checklist onboarding automatique",
    description: "Crée automatiquement une checklist quand un nouveau client signe",
    icon: "🎉",
    category: "onboarding",
    trigger: "Quand un deal est marqué 'Gagné' dans le CRM",
    actions: ["Créer checklist", "Assigner CSM", "Planifier kick-off", "Email bienvenue"],
    rules: [
      {
        id: "kickoff_delay_days",
        label: "Kick-off dans les",
        description: "Nombre de jours max pour planifier le kick-off",
        type: "duration",
        defaultValue: 5,
        unit: "jours",
        min: 1,
        max: 14,
      },
      {
        id: "send_welcome_email",
        label: "Email de bienvenue",
        description: "Envoyer un email de bienvenue automatique",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "assign_csm_auto",
        label: "Assignation CSM automatique",
        description: "Assigner le CSM avec le moins de clients actifs",
        type: "toggle",
        defaultValue: true,
      },
    ],
  },

  // ═══ REPORTING ═══
  {
    automationId: "daily-digest",
    name: "Bilan quotidien automatique",
    description: "Résumé des KPIs envoyé chaque matin",
    icon: "📊",
    category: "reporting",
    trigger: "Chaque jour à l'heure configurée",
    actions: ["Collecter KPIs", "Générer résumé", "Envoyer sur Slack/email"],
    rules: [
      {
        id: "send_time",
        label: "Heure d'envoi",
        description: "Heure à laquelle le bilan est envoyé",
        type: "select",
        defaultValue: "08:00",
        options: [
          { value: "07:00", label: "7h" },
          { value: "08:00", label: "8h" },
          { value: "09:00", label: "9h" },
          { value: "10:00", label: "10h" },
        ],
      },
      {
        id: "channel",
        label: "Canal de diffusion",
        description: "Où envoyer le bilan",
        type: "select",
        defaultValue: "slack",
        options: [
          { value: "slack", label: "Slack" },
          { value: "email", label: "Email" },
          { value: "both", label: "Les deux" },
        ],
      },
      {
        id: "include_recommendations",
        label: "Inclure les recommandations",
        description: "Ajouter les recommandations IA dans le bilan",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "weekend",
        label: "Envoyer le weekend",
        description: "Envoyer aussi le samedi et dimanche",
        type: "toggle",
        defaultValue: false,
      },
    ],
  },
];

// Get rules for a specific automation
export function getRulesForAutomation(automationId: string): AutomationWithRules | undefined {
  return automationRules.find((a) => a.automationId === automationId);
}

// Get default value for a rule, with sector override
export function getDefaultValue(rule: AutomationRule, sectorId?: string): number | string | boolean {
  if (sectorId && rule.sectorOverrides?.[sectorId] !== undefined) {
    return rule.sectorOverrides[sectorId];
  }
  return rule.defaultValue;
}
