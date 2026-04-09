// Données brutes simulées — ce qu'on récupérerait depuis les APIs
// Microsoft Graph (Outlook + Teams) et Aircall

export type RawEvent = {
  id: string;
  source: "outlook" | "teams" | "aircall";
  timestamp: string;
  from: { name: string; role: string; department: string };
  to: { name: string; role: string; department: string }[];
  subject: string;
  body: string;
  metadata?: Record<string, string>;
};

// 30 jours d'événements simulés pour une PME de 25 personnes
export const rawEvents: RawEvent[] = [
  // ===== PROCESS: ONBOARDING CLIENT =====
  {
    id: "ev-001",
    source: "outlook",
    timestamp: "2026-03-05T09:12:00",
    from: { name: "Sophie Martin", role: "Account Executive", department: "Sales" },
    to: [{ name: "Julie Renard", role: "CSM Lead", department: "Customer Success" }],
    subject: "Nouveau client signé — TechnoVert SAS",
    body: "Salut Julie, on vient de signer TechnoVert. C'est un contrat annuel, 45 licences. Ils veulent démarrer dès la semaine prochaine. Je te fais le handoff ? J'ai les contacts décisionnaires et le brief technique prêt.",
  },
  {
    id: "ev-002",
    source: "teams",
    timestamp: "2026-03-05T09:45:00",
    from: { name: "Julie Renard", role: "CSM Lead", department: "Customer Success" },
    to: [{ name: "Sophie Martin", role: "Account Executive", department: "Sales" }],
    subject: "Canal: #onboarding",
    body: "Parfait, envoie-moi la fiche client et le brief. Je planifie le kick-off pour lundi. @Marc tu peux préparer l'environnement de test pour 45 users ?",
  },
  {
    id: "ev-003",
    source: "teams",
    timestamp: "2026-03-05T10:02:00",
    from: { name: "Marc Dubois", role: "Solutions Engineer", department: "Tech" },
    to: [{ name: "Julie Renard", role: "CSM Lead", department: "Customer Success" }],
    subject: "Canal: #onboarding",
    body: "C'est noté, je prépare le tenant de test ce soir. Il me faut juste la liste des admins côté client pour les accès.",
  },
  {
    id: "ev-004",
    source: "outlook",
    timestamp: "2026-03-06T14:30:00",
    from: { name: "Julie Renard", role: "CSM Lead", department: "Customer Success" },
    to: [{ name: "Pierre Moreau", role: "Ops Manager", department: "Operations" }],
    subject: "Setup compte TechnoVert — urgent",
    body: "Pierre, peux-tu créer le compte entreprise TechnoVert dans le système ? 45 licences, plan Enterprise. Le kick-off est lundi, il faut que tout soit prêt. Merci.",
  },
  {
    id: "ev-005",
    source: "aircall",
    timestamp: "2026-03-09T10:00:00",
    from: { name: "Julie Renard", role: "CSM Lead", department: "Customer Success" },
    to: [{ name: "Client TechnoVert", role: "DG", department: "Externe" }],
    subject: "Appel — Kick-off onboarding",
    body: "Appel de bienvenue avec le client. Présentation de l'équipe, planning d'onboarding sur 5 jours, formation des admins prévue mercredi. Le client demande une intégration avec leur CRM Salesforce.",
    metadata: { duration: "32min", type: "outbound" },
  },
  {
    id: "ev-006",
    source: "outlook",
    timestamp: "2026-03-09T11:15:00",
    from: { name: "Julie Renard", role: "CSM Lead", department: "Customer Success" },
    to: [
      { name: "Marc Dubois", role: "Solutions Engineer", department: "Tech" },
      { name: "Pierre Moreau", role: "Ops Manager", department: "Operations" },
    ],
    subject: "CR Kick-off TechnoVert — action items",
    body: "Suite au call avec TechnoVert ce matin : 1) Marc → intégration Salesforce à configurer avant mercredi 2) Pierre → activer les 45 licences 3) Formation admin planifiée jeudi. Le client est enthousiaste, gardons le momentum.",
  },

  // ===== PROCESS: TRAITEMENT COMMANDE =====
  {
    id: "ev-010",
    source: "outlook",
    timestamp: "2026-03-07T08:20:00",
    from: { name: "Thomas Petit", role: "Sales Rep", department: "Sales" },
    to: [{ name: "Léa Bernard", role: "Sales Admin", department: "Sales" }],
    subject: "Commande #4521 — DataFlow Corp",
    body: "Léa, nouvelle commande de DataFlow Corp. 120 unités du pack Pro. Bon de commande en PJ. Le client veut une livraison avant le 15 mars. Peux-tu lancer le process ?",
  },
  {
    id: "ev-011",
    source: "outlook",
    timestamp: "2026-03-07T10:45:00",
    from: { name: "Léa Bernard", role: "Sales Admin", department: "Sales" },
    to: [{ name: "Antoine Roche", role: "Comptable", department: "Finance" }],
    subject: "Validation paiement — Commande #4521",
    body: "Antoine, merci de valider le paiement pour la commande #4521 de DataFlow Corp. Montant : 14 400€ HT. Conditions : paiement 30 jours. Bon de commande ci-joint.",
  },
  {
    id: "ev-012",
    source: "teams",
    timestamp: "2026-03-07T14:20:00",
    from: { name: "Antoine Roche", role: "Comptable", department: "Finance" },
    to: [{ name: "Léa Bernard", role: "Sales Admin", department: "Sales" }],
    subject: "Canal: #commandes",
    body: "Paiement validé pour #4521. L'encours client est OK. Tu peux lancer la prépa.",
  },
  {
    id: "ev-013",
    source: "teams",
    timestamp: "2026-03-07T14:35:00",
    from: { name: "Léa Bernard", role: "Sales Admin", department: "Sales" },
    to: [{ name: "Hugo Lambert", role: "Responsable Logistique", department: "Operations" }],
    subject: "Canal: #logistique",
    body: "Hugo, commande #4521 validée. 120 unités pack Pro à expédier avant le 15/03 chez DataFlow Corp. Adresse de livraison dans le bon de commande.",
  },
  {
    id: "ev-014",
    source: "outlook",
    timestamp: "2026-03-10T09:00:00",
    from: { name: "Hugo Lambert", role: "Responsable Logistique", department: "Operations" },
    to: [{ name: "Client DataFlow", role: "Responsable achats", department: "Externe" }],
    subject: "Expédition commande #4521 — tracking",
    body: "Bonjour, votre commande #4521 a été expédiée ce matin. Numéro de suivi : FR-2026-78452. Livraison prévue le 12 mars. N'hésitez pas à nous contacter en cas de question.",
  },

  // ===== PROCESS: SUPPORT TECHNIQUE =====
  {
    id: "ev-020",
    source: "aircall",
    timestamp: "2026-03-08T11:30:00",
    from: { name: "Client MediSoft", role: "Utilisateur", department: "Externe" },
    to: [{ name: "Emma Leroy", role: "Agent Support N1", department: "Support" }],
    subject: "Appel entrant — problème connexion",
    body: "Le client signale une erreur 403 quand il essaie d'accéder au tableau de bord depuis ce matin. Il a déjà essayé de vider le cache. Son abonnement est à jour.",
    metadata: { duration: "8min", type: "inbound" },
  },
  {
    id: "ev-021",
    source: "teams",
    timestamp: "2026-03-08T11:45:00",
    from: { name: "Emma Leroy", role: "Agent Support N1", department: "Support" },
    to: [{ name: "Nicolas Faure", role: "Support N2", department: "Support" }],
    subject: "Canal: #support-escalation",
    body: "Escalade : MediSoft a une erreur 403 persistante. J'ai vérifié, leur token n'est pas expiré. Ça ressemble au bug qu'on a eu la semaine dernière sur les comptes multi-tenant. Tu peux regarder ?",
  },
  {
    id: "ev-022",
    source: "teams",
    timestamp: "2026-03-08T13:10:00",
    from: { name: "Nicolas Faure", role: "Support N2", department: "Support" },
    to: [{ name: "Emma Leroy", role: "Agent Support N1", department: "Support" }],
    subject: "Canal: #support-escalation",
    body: "Trouvé — c'est bien le bug multi-tenant. Le fix du sprint dernier n'a pas été déployé en prod. Je fais un hotfix là. Ce sera résolu dans 30 min.",
  },
  {
    id: "ev-023",
    source: "teams",
    timestamp: "2026-03-08T13:20:00",
    from: { name: "Nicolas Faure", role: "Support N2", department: "Support" },
    to: [{ name: "Camille Dupont", role: "Product Manager", department: "Product" }],
    subject: "Canal: #product-bugs",
    body: "Bug report : le fix multi-tenant du sprint 42 n'a jamais atteint la prod. 3 clients impactés cette semaine. Il faut revoir le process de déploiement, c'est la 2ème fois que ça arrive.",
  },
  {
    id: "ev-024",
    source: "outlook",
    timestamp: "2026-03-08T14:00:00",
    from: { name: "Emma Leroy", role: "Agent Support N1", department: "Support" },
    to: [{ name: "Client MediSoft", role: "Utilisateur", department: "Externe" }],
    subject: "Résolution — Erreur 403 corrigée",
    body: "Bonjour, le problème de connexion que vous avez signalé a été résolu. Vous devriez pouvoir accéder au tableau de bord normalement. Nous nous excusons pour la gêne occasionnée.",
  },

  // ===== PROCESS: FACTURATION =====
  {
    id: "ev-030",
    source: "outlook",
    timestamp: "2026-03-01T08:00:00",
    from: { name: "Julie Renard", role: "CSM Lead", department: "Customer Success" },
    to: [{ name: "Marie Gauthier", role: "Billing Specialist", department: "Finance" }],
    subject: "Données usage mars — tous clients",
    body: "Marie, voici le récap d'usage du mois pour la facturation. 3 clients ont dépassé leur quota, 2 ont downgrade. Le fichier est sur le drive partagé. Quelques cas particuliers à discuter pour les tarifs négociés.",
  },
  {
    id: "ev-031",
    source: "teams",
    timestamp: "2026-03-02T10:00:00",
    from: { name: "Marie Gauthier", role: "Billing Specialist", department: "Finance" },
    to: [{ name: "François Laurent", role: "CFO", department: "Finance" }],
    subject: "Canal: #finance",
    body: "François, j'ai préparé les factures du mois. Total : 287K€. 3 factures au-dessus de 10K€ qui nécessitent ta validation avant envoi. Tu peux checker ça aujourd'hui ?",
  },
  {
    id: "ev-032",
    source: "teams",
    timestamp: "2026-03-03T16:30:00",
    from: { name: "François Laurent", role: "CFO", department: "Finance" },
    to: [{ name: "Marie Gauthier", role: "Billing Specialist", department: "Finance" }],
    subject: "Canal: #finance",
    body: "J'ai validé les 3 factures. Par contre, celle de NexGen me semble haute — vérifie les tarifs avec Julie. Pour le reste, tu peux envoyer.",
  },
  {
    id: "ev-033",
    source: "outlook",
    timestamp: "2026-03-05T09:00:00",
    from: { name: "Marie Gauthier", role: "Billing Specialist", department: "Finance" },
    to: [{ name: "Antoine Roche", role: "Comptable", department: "Finance" }],
    subject: "Factures mars validées — à comptabiliser",
    body: "Antoine, toutes les factures de mars sont validées et envoyées aux clients. 42 factures, total 287K€. Merci de les enregistrer en compta. Échéances et détails dans le fichier joint.",
  },

  // ===== BRUIT (newsletters, notifs, etc.) — sera filtré par Haiku =====
  {
    id: "ev-100",
    source: "outlook",
    timestamp: "2026-03-05T07:00:00",
    from: { name: "LinkedIn", role: "Newsletter", department: "Externe" },
    to: [{ name: "Sophie Martin", role: "Account Executive", department: "Sales" }],
    subject: "Vos 5 nouvelles notifications LinkedIn",
    body: "Vous avez 5 nouvelles notifications. Pierre Moreau a commenté votre publication...",
  },
  {
    id: "ev-101",
    source: "outlook",
    timestamp: "2026-03-06T08:00:00",
    from: { name: "Jira", role: "Notification", department: "Externe" },
    to: [{ name: "Marc Dubois", role: "Solutions Engineer", department: "Tech" }],
    subject: "[JIRA] PULSE-234 moved to In Progress",
    body: "Marc Dubois moved PULSE-234 'Fix multi-tenant auth' to In Progress.",
  },
  {
    id: "ev-102",
    source: "outlook",
    timestamp: "2026-03-07T12:00:00",
    from: { name: "Stripe", role: "Notification", department: "Externe" },
    to: [{ name: "Marie Gauthier", role: "Billing Specialist", department: "Finance" }],
    subject: "Payment received — INV-2026-0342",
    body: "You received a payment of €4,200.00 from DataFlow Corp for invoice INV-2026-0342.",
  },
  {
    id: "ev-103",
    source: "teams",
    timestamp: "2026-03-08T12:30:00",
    from: { name: "Emma Leroy", role: "Agent Support N1", department: "Support" },
    to: [{ name: "Nicolas Faure", role: "Support N2", department: "Support" }],
    subject: "Canal: #random",
    body: "Qui veut commander des sushis pour ce midi ? 🍣",
  },
];
