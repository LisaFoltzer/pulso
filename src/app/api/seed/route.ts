import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Seed the knowledge base with Level 1 public data
export async function POST() {
  try {
    // ── Sectors ──
    const sectors = [
      { id: "ecommerce", name: "E-commerce / DTC", description: "Vente directe au consommateur, marques en ligne" },
      { id: "saas", name: "SaaS / Tech", description: "Entreprises de logiciel, abonnement" },
      { id: "consulting", name: "Consulting / Agence", description: "Services, conseil, agences" },
      { id: "retail", name: "Retail / Commerce", description: "Points de vente physiques et en ligne" },
      { id: "healthcare", name: "Santé / Bien-être", description: "Cliniques, compléments, pharma" },
      { id: "realestate", name: "Immobilier", description: "Gestion, transaction, location" },
      { id: "logistics", name: "Logistique / Transport", description: "Supply chain, livraison, entreposage" },
    ];

    await supabase.from("sectors").upsert(sectors, { onConflict: "id" });

    // ── Process Patterns ──
    const patterns = [
      // E-COMMERCE
      {
        id: "ecom-order-fulfillment", sector_id: "ecommerce", name: "Traitement des commandes",
        aliases: ["order processing", "fulfillment", "expédition"],
        keywords: ["commande", "order", "livraison", "tracking", "expédition", "colis", "shipping"],
        typical_steps: [
          { order: 1, name: "Réception commande", role: "Système" },
          { order: 2, name: "Validation paiement", role: "Finance" },
          { order: 3, name: "Préparation", role: "Logistique" },
          { order: 4, name: "Expédition", role: "Logistique" },
          { order: 5, name: "Notification tracking", role: "Service Client" },
          { order: 6, name: "Livraison", role: "Transporteur" },
        ],
        typical_roles: ["E-commerce Manager", "Logistique", "Finance", "Service Client"],
        typical_flows: [
          { from: "E-commerce Manager", to: "Logistique", type: "demande" },
          { from: "Finance", to: "Logistique", type: "validation" },
          { from: "Logistique", to: "Transporteur", type: "handoff" },
        ],
        frequency: "daily", avg_duration: "1-3 jours",
        red_flags: ["délai expédition > 48h", "taux erreur > 2%", "tracking non envoyé"],
        kpis: ["Délai expédition", "Taux livraison à temps", "Taux erreur"],
      },
      {
        id: "ecom-returns", sector_id: "ecommerce", name: "Gestion des retours",
        aliases: ["retours", "returns", "remboursements", "RMA"],
        keywords: ["retour", "return", "remboursement", "refund", "échange", "avoir"],
        typical_steps: [
          { order: 1, name: "Demande retour", role: "Client" },
          { order: 2, name: "Validation motif", role: "Service Client" },
          { order: 3, name: "Envoi étiquette", role: "Logistique" },
          { order: 4, name: "Réception & inspection", role: "Warehouse" },
          { order: 5, name: "Remboursement", role: "Finance" },
        ],
        typical_roles: ["Service Client", "Logistique", "Warehouse", "Finance"],
        typical_flows: [
          { from: "Service Client", to: "Logistique", type: "demande" },
          { from: "Warehouse", to: "Finance", type: "validation" },
        ],
        frequency: "daily", avg_duration: "5-10 jours",
        red_flags: ["délai remboursement > 7j", "taux retour > 15%"],
        kpis: ["Taux retour", "Délai remboursement", "CSAT post-retour"],
      },
      {
        id: "ecom-supplier", sector_id: "ecommerce", name: "Gestion fournisseurs & approvisionnement",
        aliases: ["supply chain", "approvisionnement", "achat", "réappro"],
        keywords: ["fournisseur", "supplier", "stock", "réappro", "purchase order", "MOQ", "inventory"],
        typical_steps: [
          { order: 1, name: "Détection besoin stock", role: "Ops" },
          { order: 2, name: "Commande fournisseur", role: "Achats" },
          { order: 3, name: "Suivi livraison", role: "Achats" },
          { order: 4, name: "Réception", role: "Warehouse" },
          { order: 5, name: "Contrôle qualité", role: "Qualité" },
          { order: 6, name: "Mise en stock", role: "Warehouse" },
        ],
        typical_roles: ["Achats", "Ops Manager", "Warehouse", "Fournisseur"],
        typical_flows: [
          { from: "Ops Manager", to: "Achats", type: "demande" },
          { from: "Achats", to: "Fournisseur", type: "demande" },
          { from: "Fournisseur", to: "Warehouse", type: "livraison" },
        ],
        frequency: "weekly", avg_duration: "2-8 semaines",
        red_flags: ["rupture stock", "retard fournisseur > 5j", "qualité non conforme > 3%"],
        kpis: ["Taux rupture", "Délai fournisseur", "Conformité qualité"],
      },
      {
        id: "ecom-support", sector_id: "ecommerce", name: "Support client",
        aliases: ["SAV", "service client", "helpdesk"],
        keywords: ["ticket", "réclamation", "problème", "support", "SAV", "aide"],
        typical_steps: [
          { order: 1, name: "Réception demande", role: "Support N1" },
          { order: 2, name: "Qualification", role: "Support N1" },
          { order: 3, name: "Résolution ou escalade", role: "Support N1/N2" },
          { order: 4, name: "Clôture & feedback", role: "Support" },
        ],
        typical_roles: ["Support N1", "Support N2", "Tech Support", "Product"],
        typical_flows: [
          { from: "Client", to: "Support N1", type: "demande" },
          { from: "Support N1", to: "Support N2", type: "escalade" },
        ],
        frequency: "daily", avg_duration: "1-48 heures",
        red_flags: ["résolution > 24h", "escalade > 30%", "même problème 3+ fois"],
        kpis: ["Temps résolution", "Taux N1", "CSAT"],
      },
      {
        id: "ecom-marketing", sector_id: "ecommerce", name: "Campagnes marketing",
        aliases: ["marketing", "ads", "publicité", "Meta Ads"],
        keywords: ["campagne", "ads", "publicité", "Meta", "Google", "newsletter", "conversion", "ROI"],
        typical_steps: [
          { order: 1, name: "Brief", role: "Marketing Manager" },
          { order: 2, name: "Création assets", role: "Designer" },
          { order: 3, name: "Validation", role: "Direction" },
          { order: 4, name: "Mise en ligne", role: "Média Buyer" },
          { order: 5, name: "Suivi performance", role: "Data" },
        ],
        typical_roles: ["Marketing Manager", "Designer", "Média Buyer", "Direction"],
        typical_flows: [
          { from: "Marketing Manager", to: "Designer", type: "demande" },
          { from: "Designer", to: "Marketing Manager", type: "livraison" },
        ],
        frequency: "weekly", avg_duration: "3-14 jours",
        red_flags: ["validation > 3j", "pas de suivi performance"],
        kpis: ["ROAS", "CPA", "Taux conversion", "Délai brief-to-live"],
      },
      {
        id: "ecom-billing", sector_id: "ecommerce", name: "Facturation",
        aliases: ["facturation", "billing", "invoicing"],
        keywords: ["facture", "invoice", "paiement", "relance", "avoir", "échéance"],
        typical_steps: [
          { order: 1, name: "Collecte données", role: "Ops" },
          { order: 2, name: "Génération facture", role: "Billing" },
          { order: 3, name: "Validation", role: "Direction Financière" },
          { order: 4, name: "Envoi client", role: "Billing" },
          { order: 5, name: "Suivi paiement", role: "Comptabilité" },
        ],
        typical_roles: ["Account Manager", "Billing", "Comptabilité", "Direction Financière"],
        typical_flows: [
          { from: "Account Manager", to: "Billing", type: "information" },
          { from: "Billing", to: "Direction Financière", type: "validation" },
        ],
        frequency: "monthly", avg_duration: "3-7 jours",
        red_flags: ["cycle > 5j", "validation bloquée > 2j", "retard paiement > 30j"],
        kpis: ["Cycle facturation", "Taux paiement à temps", "DSO"],
      },
      // SAAS
      {
        id: "saas-onboarding", sector_id: "saas", name: "Onboarding client",
        aliases: ["onboarding", "intégration client", "activation"],
        keywords: ["onboarding", "setup", "kick-off", "formation", "go-live", "bienvenue"],
        typical_steps: [
          { order: 1, name: "Handoff Sales → CS", role: "Account Executive" },
          { order: 2, name: "Kick-off", role: "CSM" },
          { order: 3, name: "Configuration", role: "Solutions Engineer" },
          { order: 4, name: "Formation", role: "CSM" },
          { order: 5, name: "Go-live", role: "CSM" },
        ],
        typical_roles: ["Account Executive", "CSM", "Solutions Engineer"],
        typical_flows: [
          { from: "Account Executive", to: "CSM", type: "handoff" },
          { from: "CSM", to: "Solutions Engineer", type: "demande" },
        ],
        frequency: "ad-hoc", avg_duration: "1-4 semaines",
        red_flags: ["onboarding > 30j", "pas de kick-off en 5j", "client inactif"],
        kpis: ["Time to value", "Activation rate", "Délai onboarding"],
      },
      {
        id: "saas-bugs", sector_id: "saas", name: "Résolution de bugs",
        aliases: ["bug fix", "incident", "hotfix"],
        keywords: ["bug", "fix", "incident", "erreur", "crash", "deploy", "patch"],
        typical_steps: [
          { order: 1, name: "Signalement", role: "Support/QA" },
          { order: 2, name: "Triage", role: "Product/Tech Lead" },
          { order: 3, name: "Fix", role: "Développeur" },
          { order: 4, name: "Review", role: "Tech Lead" },
          { order: 5, name: "Deploy", role: "DevOps" },
        ],
        typical_roles: ["Support", "Product Manager", "Développeur", "DevOps"],
        typical_flows: [
          { from: "Support", to: "Product Manager", type: "escalade" },
          { from: "Product Manager", to: "Développeur", type: "demande" },
        ],
        frequency: "daily", avg_duration: "1-72 heures",
        red_flags: ["même bug 3+ fois", "fix pas déployé", "pas de post-mortem"],
        kpis: ["Temps résolution", "Taux regression", "Bugs critiques"],
      },
      // CONSULTING
      {
        id: "consulting-delivery", sector_id: "consulting", name: "Delivery projet client",
        aliases: ["projet", "delivery", "mission", "prestation"],
        keywords: ["projet", "mission", "livrable", "deadline", "sprint", "delivery", "specs"],
        typical_steps: [
          { order: 1, name: "Brief & cadrage", role: "Chef de projet" },
          { order: 2, name: "Spécifications", role: "Chef de projet / Client" },
          { order: 3, name: "Production", role: "Équipe delivery" },
          { order: 4, name: "Revue interne", role: "Lead" },
          { order: 5, name: "Livraison", role: "Chef de projet" },
          { order: 6, name: "Recette", role: "Client" },
        ],
        typical_roles: ["Account Manager", "Chef de projet", "Équipe delivery", "Client"],
        typical_flows: [
          { from: "Account Manager", to: "Chef de projet", type: "handoff" },
          { from: "Chef de projet", to: "Équipe delivery", type: "demande" },
        ],
        frequency: "ad-hoc", avg_duration: "2-12 semaines",
        red_flags: ["scope creep", "client silencieux > 5j", "pas de suivi heures"],
        kpis: ["Marge projet", "Respect deadline", "NPS client"],
      },
      {
        id: "consulting-billing", sector_id: "consulting", name: "Suivi heures & facturation prestations",
        aliases: ["timesheet", "time tracking", "facturation prestation"],
        keywords: ["heures", "timesheet", "facturation", "TJM", "plafond", "récap"],
        typical_steps: [
          { order: 1, name: "Saisie heures", role: "Consultant" },
          { order: 2, name: "Validation manager", role: "Manager" },
          { order: 3, name: "Consolidation", role: "Finance" },
          { order: 4, name: "Facture", role: "Finance" },
          { order: 5, name: "Envoi & suivi", role: "Finance" },
        ],
        typical_roles: ["Consultant", "Manager", "Finance"],
        typical_flows: [
          { from: "Consultant", to: "Manager", type: "information" },
          { from: "Manager", to: "Finance", type: "validation" },
        ],
        frequency: "monthly", avg_duration: "3-7 jours",
        red_flags: ["heures non saisies > 3j", "facturation retard > 10j"],
        kpis: ["Taux saisie", "Délai facturation", "Taux recouvrement"],
      },
    ];

    await supabase.from("process_patterns").upsert(patterns, { onConflict: "id" });

    // ── Benchmarks ──
    const benchmarks = [
      // E-commerce - Commandes
      { pattern_id: "ecom-order-fulfillment", metric: "Délai expédition", unit: "heures", top_quartile: 4, median: 18, bottom_quartile: 48, source: "Benchmark PME e-commerce 2025", sample_size: 250 },
      { pattern_id: "ecom-order-fulfillment", metric: "Taux livraison à temps", unit: "%", top_quartile: 98, median: 92, bottom_quartile: 82, source: "Benchmark PME e-commerce 2025", sample_size: 250 },
      { pattern_id: "ecom-order-fulfillment", metric: "Taux erreur préparation", unit: "%", top_quartile: 0.5, median: 2, bottom_quartile: 5, source: "Benchmark PME e-commerce 2025", sample_size: 180 },
      // E-commerce - Retours
      { pattern_id: "ecom-returns", metric: "Taux de retour", unit: "%", top_quartile: 3, median: 8, bottom_quartile: 18, source: "Benchmark DTC 2025", sample_size: 200 },
      { pattern_id: "ecom-returns", metric: "Délai remboursement", unit: "jours", top_quartile: 2, median: 5, bottom_quartile: 12, source: "Benchmark DTC 2025", sample_size: 200 },
      // E-commerce - Fournisseurs
      { pattern_id: "ecom-supplier", metric: "Taux rupture stock", unit: "%", top_quartile: 1, median: 4, bottom_quartile: 12, source: "Benchmark supply chain PME 2025", sample_size: 150 },
      { pattern_id: "ecom-supplier", metric: "Délai fournisseur", unit: "jours", top_quartile: 7, median: 21, bottom_quartile: 45, source: "Benchmark supply chain PME 2025", sample_size: 150 },
      // E-commerce - Support
      { pattern_id: "ecom-support", metric: "Temps résolution", unit: "heures", top_quartile: 2, median: 8, bottom_quartile: 24, source: "Benchmark support PME 2025", sample_size: 300 },
      { pattern_id: "ecom-support", metric: "Taux résolution N1", unit: "%", top_quartile: 85, median: 70, bottom_quartile: 50, source: "Benchmark support PME 2025", sample_size: 300 },
      { pattern_id: "ecom-support", metric: "CSAT", unit: "/10", top_quartile: 9, median: 7.5, bottom_quartile: 6, source: "Benchmark support PME 2025", sample_size: 200 },
      // E-commerce - Marketing
      { pattern_id: "ecom-marketing", metric: "Délai brief-to-live", unit: "jours", top_quartile: 2, median: 7, bottom_quartile: 14, source: "Benchmark marketing digital 2025", sample_size: 180 },
      { pattern_id: "ecom-marketing", metric: "ROAS moyen", unit: "x", top_quartile: 5, median: 3, bottom_quartile: 1.5, source: "Benchmark Meta/Google Ads 2025", sample_size: 400 },
      // E-commerce - Facturation
      { pattern_id: "ecom-billing", metric: "Cycle facturation", unit: "jours", top_quartile: 1, median: 3, bottom_quartile: 7, source: "Benchmark finance PME 2025", sample_size: 200 },
      { pattern_id: "ecom-billing", metric: "Taux paiement à temps", unit: "%", top_quartile: 95, median: 82, bottom_quartile: 65, source: "Benchmark finance PME 2025", sample_size: 200 },
      { pattern_id: "ecom-billing", metric: "DSO", unit: "jours", top_quartile: 25, median: 42, bottom_quartile: 65, source: "Benchmark finance PME 2025", sample_size: 200 },
      // SaaS - Onboarding
      { pattern_id: "saas-onboarding", metric: "Time to value", unit: "jours", top_quartile: 3, median: 14, bottom_quartile: 30, source: "Benchmark SaaS B2B 2025", sample_size: 150 },
      { pattern_id: "saas-onboarding", metric: "Activation rate", unit: "%", top_quartile: 90, median: 65, bottom_quartile: 40, source: "Benchmark SaaS B2B 2025", sample_size: 150 },
      // SaaS - Bugs
      { pattern_id: "saas-bugs", metric: "Temps résolution critique", unit: "heures", top_quartile: 2, median: 12, bottom_quartile: 48, source: "Benchmark SaaS 2025", sample_size: 120 },
      { pattern_id: "saas-bugs", metric: "Taux regression", unit: "%", top_quartile: 2, median: 8, bottom_quartile: 20, source: "Benchmark SaaS 2025", sample_size: 120 },
      // Consulting
      { pattern_id: "consulting-delivery", metric: "Marge projet", unit: "%", top_quartile: 40, median: 25, bottom_quartile: 10, source: "Benchmark consulting 2025", sample_size: 100 },
      { pattern_id: "consulting-delivery", metric: "Respect deadline", unit: "%", top_quartile: 95, median: 75, bottom_quartile: 50, source: "Benchmark consulting 2025", sample_size: 100 },
      { pattern_id: "consulting-billing", metric: "Taux saisie heures", unit: "%", top_quartile: 95, median: 75, bottom_quartile: 50, source: "Benchmark consulting 2025", sample_size: 80 },
      { pattern_id: "consulting-billing", metric: "Délai facturation", unit: "jours", top_quartile: 2, median: 7, bottom_quartile: 15, source: "Benchmark consulting 2025", sample_size: 80 },
    ];

    await supabase.from("benchmarks").upsert(benchmarks, { ignoreDuplicates: true });

    // Count what we inserted
    const { count: sectorCount } = await supabase.from("sectors").select("*", { count: "exact", head: true });
    const { count: patternCount } = await supabase.from("process_patterns").select("*", { count: "exact", head: true });
    const { count: benchmarkCount } = await supabase.from("benchmarks").select("*", { count: "exact", head: true });

    return NextResponse.json({
      success: true,
      sectors: sectorCount,
      patterns: patternCount,
      benchmarks: benchmarkCount,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
