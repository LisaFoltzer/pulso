// Extended Sector Library — adds 6 new sectors to Pulso's knowledge base
// Each sector has 3-5 typical processes with detection signals, steps, benchmarks

import type { ProcessPattern, SectorProfile, Benchmark } from "./process-patterns";

export const extendedSectors: SectorProfile[] = [

  // ═══ REAL ESTATE ═══
  {
    id: "realestate",
    name: "Real Estate / Property Management",
    description: "Property sales, rentals, property management, construction",
    processes: [
      {
        id: "re-lead-to-close",
        name: "Lead to Close (Sales)",
        aliases: ["property sale", "deal closing", "transaction", "mandate"],
        description: "Full property sales cycle from lead generation to closing",
        keywords: ["property", "listing", "offer", "mortgage", "closing", "visit", "mandate", "buyer", "seller", "notary", "deed"],
        typicalSteps: [
          { order: 1, name: "Lead qualification", role: "Agent" },
          { order: 2, name: "Property matching", role: "Agent" },
          { order: 3, name: "Visits scheduling", role: "Agent / Assistant" },
          { order: 4, name: "Offer negotiation", role: "Agent" },
          { order: 5, name: "Mortgage pre-approval", role: "Buyer / Bank" },
          { order: 6, name: "Legal review", role: "Notary / Lawyer" },
          { order: 7, name: "Closing", role: "Notary" },
        ],
        typicalRoles: ["Agent", "Assistant", "Notary", "Buyer", "Seller", "Bank"],
        typicalFlows: [
          { from: "Agent", to: "Assistant", type: "demande" },
          { from: "Agent", to: "Buyer", type: "livraison" },
          { from: "Agent", to: "Notary", type: "handoff" },
          { from: "Notary", to: "Buyer", type: "livraison" },
        ],
        frequency: "ad-hoc",
        avgDuration: "30-90 days",
        redFlags: ["lead response > 24h", "no follow-up after visit", "closing delayed > 2 weeks", "mortgage approval > 30 days"],
        kpis: ["Lead to close time", "Conversion rate", "Visits per sale", "Commission per agent"],
        benchmarks: [
          { metric: "Lead response time", unit: "hours", topQuartile: 1, median: 6, bottomQuartile: 24, source: "Real estate benchmark 2025" },
          { metric: "Lead to close time", unit: "days", topQuartile: 30, median: 60, bottomQuartile: 120, source: "Real estate benchmark 2025" },
          { metric: "Conversion rate (lead to sale)", unit: "%", topQuartile: 5, median: 2, bottomQuartile: 0.5, source: "Real estate benchmark 2025" },
          { metric: "Visits per sale", unit: "visits", topQuartile: 4, median: 8, bottomQuartile: 15, source: "Industry estimate" },
        ],
      },
      {
        id: "re-tenant-management",
        name: "Tenant Management",
        aliases: ["rental management", "lease", "tenant onboarding", "rent collection"],
        description: "Managing tenants from application to move-out",
        keywords: ["tenant", "lease", "rent", "deposit", "maintenance", "move-in", "move-out", "inspection"],
        typicalSteps: [
          { order: 1, name: "Application review", role: "Property Manager" },
          { order: 2, name: "Background check", role: "Property Manager" },
          { order: 3, name: "Lease signing", role: "Property Manager / Tenant" },
          { order: 4, name: "Move-in inspection", role: "Property Manager" },
          { order: 5, name: "Rent collection", role: "Accounting" },
          { order: 6, name: "Maintenance handling", role: "Maintenance / Vendor" },
        ],
        typicalRoles: ["Property Manager", "Tenant", "Accounting", "Maintenance", "Vendor"],
        typicalFlows: [
          { from: "Tenant", to: "Property Manager", type: "demande" },
          { from: "Property Manager", to: "Maintenance", type: "demande" },
          { from: "Accounting", to: "Tenant", type: "notification" },
        ],
        frequency: "monthly",
        avgDuration: "ongoing",
        redFlags: ["rent payment > 5 days late", "maintenance response > 48h", "vacancy > 30 days", "lease renewal rate < 60%"],
        kpis: ["Occupancy rate", "Rent collection rate", "Maintenance response time", "Lease renewal rate"],
        benchmarks: [
          { metric: "Occupancy rate", unit: "%", topQuartile: 97, median: 93, bottomQuartile: 85, source: "Property management benchmark 2025" },
          { metric: "Rent collection rate (on time)", unit: "%", topQuartile: 98, median: 92, bottomQuartile: 80, source: "Property management benchmark 2025" },
          { metric: "Maintenance response time", unit: "hours", topQuartile: 4, median: 24, bottomQuartile: 72, source: "Property management benchmark 2025" },
        ],
      },
    ],
  },

  // ═══ HEALTHCARE / WELLNESS ═══
  {
    id: "healthcare",
    name: "Healthcare / Wellness",
    description: "Clinics, supplements, pharma, wellness brands",
    processes: [
      {
        id: "hc-patient-journey",
        name: "Patient Journey",
        aliases: ["patient intake", "appointment", "consultation", "treatment"],
        description: "From booking to follow-up care",
        keywords: ["patient", "appointment", "consultation", "diagnosis", "treatment", "prescription", "follow-up", "referral"],
        typicalSteps: [
          { order: 1, name: "Booking / Intake", role: "Reception / System" },
          { order: 2, name: "Pre-visit questionnaire", role: "Patient / System" },
          { order: 3, name: "Consultation", role: "Practitioner" },
          { order: 4, name: "Treatment / Prescription", role: "Practitioner" },
          { order: 5, name: "Billing", role: "Billing" },
          { order: 6, name: "Follow-up scheduling", role: "Reception" },
        ],
        typicalRoles: ["Reception", "Practitioner", "Patient", "Billing", "Lab"],
        typicalFlows: [
          { from: "Patient", to: "Reception", type: "demande" },
          { from: "Reception", to: "Practitioner", type: "handoff" },
          { from: "Practitioner", to: "Billing", type: "information" },
          { from: "Practitioner", to: "Patient", type: "livraison" },
        ],
        frequency: "daily",
        avgDuration: "1-3 hours",
        redFlags: ["wait time > 30min", "no follow-up scheduled", "billing errors > 3%", "no-show rate > 15%"],
        kpis: ["Wait time", "Patient satisfaction", "No-show rate", "Revenue per visit"],
        benchmarks: [
          { metric: "Average wait time", unit: "minutes", topQuartile: 10, median: 25, bottomQuartile: 45, source: "Healthcare benchmark 2025" },
          { metric: "No-show rate", unit: "%", topQuartile: 5, median: 12, bottomQuartile: 25, source: "Healthcare benchmark 2025" },
          { metric: "Patient satisfaction (NPS)", unit: "score", topQuartile: 70, median: 45, bottomQuartile: 20, source: "Healthcare benchmark 2025" },
        ],
      },
      {
        id: "hc-supplement-order",
        name: "Supplement / Product Order Fulfillment",
        aliases: ["supplement order", "product fulfillment", "DTC health"],
        description: "Order processing for health products and supplements",
        keywords: ["order", "supplement", "collagen", "vitamin", "shipping", "subscription", "fulfillment"],
        typicalSteps: [
          { order: 1, name: "Order received", role: "System" },
          { order: 2, name: "Payment validation", role: "Finance" },
          { order: 3, name: "Warehouse picking", role: "Warehouse" },
          { order: 4, name: "Quality check", role: "QA" },
          { order: 5, name: "Shipping", role: "Logistics" },
          { order: 6, name: "Delivery confirmation", role: "System" },
        ],
        typicalRoles: ["E-commerce Manager", "Warehouse", "QA", "Logistics", "Customer Service"],
        typicalFlows: [
          { from: "System", to: "Warehouse", type: "demande" },
          { from: "Warehouse", to: "QA", type: "handoff" },
          { from: "QA", to: "Logistics", type: "handoff" },
          { from: "Logistics", to: "Customer Service", type: "information" },
        ],
        frequency: "daily",
        avgDuration: "1-5 days",
        redFlags: ["shipping delay > 48h", "return rate > 8%", "quality issue > 1%", "subscription churn > 10%/month"],
        kpis: ["Fulfillment time", "Return rate", "Subscription retention", "COGS per order"],
        benchmarks: [
          { metric: "Order to ship time", unit: "hours", topQuartile: 8, median: 24, bottomQuartile: 72, source: "DTC health benchmark 2025" },
          { metric: "Return rate", unit: "%", topQuartile: 2, median: 5, bottomQuartile: 12, source: "DTC health benchmark 2025" },
          { metric: "Subscription retention (monthly)", unit: "%", topQuartile: 95, median: 88, bottomQuartile: 75, source: "DTC health benchmark 2025" },
        ],
      },
    ],
  },

  // ═══ RETAIL ═══
  {
    id: "retail",
    name: "Retail / Physical Stores",
    description: "Physical retail, multi-store, franchise",
    processes: [
      {
        id: "rt-inventory",
        name: "Inventory Management",
        aliases: ["stock management", "replenishment", "inventory count", "reorder"],
        description: "Managing stock levels across stores and warehouse",
        keywords: ["inventory", "stock", "reorder", "warehouse", "SKU", "count", "shortage", "overstock"],
        typicalSteps: [
          { order: 1, name: "Stock level monitoring", role: "Store Manager / System" },
          { order: 2, name: "Reorder trigger", role: "System / Buyer" },
          { order: 3, name: "Purchase order to supplier", role: "Buyer" },
          { order: 4, name: "Receiving and inspection", role: "Warehouse" },
          { order: 5, name: "Distribution to stores", role: "Logistics" },
          { order: 6, name: "Shelf stocking", role: "Store Team" },
        ],
        typicalRoles: ["Store Manager", "Buyer", "Warehouse", "Logistics", "Supplier"],
        typicalFlows: [
          { from: "Store Manager", to: "Buyer", type: "demande" },
          { from: "Buyer", to: "Supplier", type: "demande" },
          { from: "Supplier", to: "Warehouse", type: "livraison" },
          { from: "Warehouse", to: "Store Manager", type: "notification" },
        ],
        frequency: "weekly",
        avgDuration: "1-4 weeks",
        redFlags: ["stockout > 2 days", "overstock > 20% of SKUs", "supplier lead time > 3 weeks", "shrinkage > 2%"],
        kpis: ["Stockout rate", "Inventory turnover", "Shrinkage rate", "Days of supply"],
        benchmarks: [
          { metric: "Stockout rate", unit: "%", topQuartile: 2, median: 5, bottomQuartile: 12, source: "Retail benchmark 2025" },
          { metric: "Inventory turnover", unit: "x/year", topQuartile: 12, median: 6, bottomQuartile: 3, source: "Retail benchmark 2025" },
          { metric: "Shrinkage rate", unit: "%", topQuartile: 0.5, median: 1.5, bottomQuartile: 3, source: "Retail benchmark 2025" },
        ],
      },
      {
        id: "rt-customer-service",
        name: "In-Store Customer Service",
        aliases: ["customer complaint", "return", "exchange", "customer request"],
        description: "Handling customer requests, complaints, returns in store",
        keywords: ["complaint", "return", "exchange", "refund", "customer", "satisfaction", "warranty"],
        typicalSteps: [
          { order: 1, name: "Customer request", role: "Customer / Staff" },
          { order: 2, name: "Assessment", role: "Staff" },
          { order: 3, name: "Resolution or escalation", role: "Staff / Manager" },
          { order: 4, name: "Processing (return/exchange)", role: "Staff" },
          { order: 5, name: "Follow-up", role: "Customer Service" },
        ],
        typicalRoles: ["Staff", "Store Manager", "Customer Service", "Customer"],
        typicalFlows: [
          { from: "Customer", to: "Staff", type: "demande" },
          { from: "Staff", to: "Store Manager", type: "escalade" },
          { from: "Staff", to: "Customer", type: "livraison" },
        ],
        frequency: "daily",
        avgDuration: "15-60 minutes",
        redFlags: ["complaint resolution > 48h", "return rate > 10%", "NPS < 30", "repeat complaints > 5%"],
        kpis: ["Resolution time", "Customer satisfaction", "Return rate", "Repeat visit rate"],
        benchmarks: [
          { metric: "Complaint resolution time", unit: "hours", topQuartile: 1, median: 4, bottomQuartile: 24, source: "Retail service benchmark 2025" },
          { metric: "NPS (in-store)", unit: "score", topQuartile: 60, median: 35, bottomQuartile: 10, source: "Retail service benchmark 2025" },
        ],
      },
    ],
  },

  // ═══ LOGISTICS / TRANSPORT ═══
  {
    id: "logistics",
    name: "Logistics / Transport",
    description: "Shipping, warehousing, freight, delivery services",
    processes: [
      {
        id: "lg-order-delivery",
        name: "Order to Delivery",
        aliases: ["delivery", "shipment", "freight", "last mile", "dispatch"],
        description: "Full delivery cycle from order to proof of delivery",
        keywords: ["delivery", "shipment", "tracking", "driver", "route", "dispatch", "POD", "warehouse"],
        typicalSteps: [
          { order: 1, name: "Order received", role: "Dispatcher" },
          { order: 2, name: "Route planning", role: "Dispatcher" },
          { order: 3, name: "Warehouse picking", role: "Warehouse" },
          { order: 4, name: "Loading", role: "Warehouse / Driver" },
          { order: 5, name: "Transit", role: "Driver" },
          { order: 6, name: "Delivery + POD", role: "Driver" },
          { order: 7, name: "Invoice", role: "Billing" },
        ],
        typicalRoles: ["Dispatcher", "Warehouse", "Driver", "Customer", "Billing"],
        typicalFlows: [
          { from: "Dispatcher", to: "Warehouse", type: "demande" },
          { from: "Warehouse", to: "Driver", type: "handoff" },
          { from: "Driver", to: "Customer", type: "livraison" },
          { from: "Driver", to: "Billing", type: "information" },
        ],
        frequency: "daily",
        avgDuration: "4-48 hours",
        redFlags: ["delivery delay > 2h", "failed delivery > 5%", "no POD captured", "route efficiency < 80%"],
        kpis: ["On-time delivery rate", "Cost per delivery", "Failed delivery rate", "Route efficiency"],
        benchmarks: [
          { metric: "On-time delivery rate", unit: "%", topQuartile: 97, median: 90, bottomQuartile: 80, source: "Logistics benchmark 2025" },
          { metric: "Cost per delivery", unit: "EUR", topQuartile: 5, median: 12, bottomQuartile: 25, source: "Logistics benchmark 2025" },
          { metric: "Failed delivery rate", unit: "%", topQuartile: 1, median: 5, bottomQuartile: 12, source: "Logistics benchmark 2025" },
        ],
      },
    ],
  },

  // ═══ FOOD / RESTAURANT ═══
  {
    id: "food",
    name: "Food / Restaurant / F&B",
    description: "Restaurants, food delivery, catering, food production",
    processes: [
      {
        id: "fd-order-to-table",
        name: "Order to Table",
        aliases: ["kitchen order", "service", "food preparation", "table service"],
        description: "From customer order to food served",
        keywords: ["order", "kitchen", "table", "prep", "serve", "bill", "reservation"],
        typicalSteps: [
          { order: 1, name: "Order taken", role: "Server" },
          { order: 2, name: "Order to kitchen", role: "Server / POS" },
          { order: 3, name: "Preparation", role: "Kitchen" },
          { order: 4, name: "Quality check", role: "Head Chef" },
          { order: 5, name: "Service", role: "Server" },
          { order: 6, name: "Bill + Payment", role: "Server / Cashier" },
        ],
        typicalRoles: ["Server", "Kitchen", "Head Chef", "Cashier", "Manager"],
        typicalFlows: [
          { from: "Server", to: "Kitchen", type: "demande" },
          { from: "Kitchen", to: "Head Chef", type: "validation" },
          { from: "Server", to: "Customer", type: "livraison" },
        ],
        frequency: "daily",
        avgDuration: "15-45 minutes",
        redFlags: ["table wait > 20min", "order error > 3%", "food waste > 10%", "customer complaint > 2%"],
        kpis: ["Average service time", "Table turnover", "Food cost ratio", "Customer satisfaction"],
        benchmarks: [
          { metric: "Average ticket time", unit: "minutes", topQuartile: 12, median: 20, bottomQuartile: 35, source: "Restaurant benchmark 2025" },
          { metric: "Food cost ratio", unit: "%", topQuartile: 25, median: 32, bottomQuartile: 40, source: "Restaurant benchmark 2025" },
          { metric: "Table turnover (dinner)", unit: "x/night", topQuartile: 3, median: 2, bottomQuartile: 1.2, source: "Restaurant benchmark 2025" },
        ],
      },
      {
        id: "fd-supplier-procurement",
        name: "Food Supplier Procurement",
        aliases: ["food ordering", "supplier management", "ingredient sourcing"],
        description: "Ordering ingredients from suppliers",
        keywords: ["supplier", "ingredient", "order", "delivery", "freshness", "cost", "menu"],
        typicalSteps: [
          { order: 1, name: "Inventory check", role: "Chef / Manager" },
          { order: 2, name: "Order placement", role: "Manager" },
          { order: 3, name: "Supplier confirmation", role: "Supplier" },
          { order: 4, name: "Delivery + inspection", role: "Kitchen" },
          { order: 5, name: "Storage", role: "Kitchen" },
        ],
        typicalRoles: ["Chef", "Manager", "Supplier", "Kitchen Staff"],
        typicalFlows: [
          { from: "Chef", to: "Manager", type: "demande" },
          { from: "Manager", to: "Supplier", type: "demande" },
          { from: "Supplier", to: "Kitchen", type: "livraison" },
        ],
        frequency: "daily",
        avgDuration: "1-3 days",
        redFlags: ["delivery no-show", "quality issue > 5%", "price increase > 10%", "stockout on key ingredient"],
        kpis: ["Supplier reliability", "Cost per ingredient", "Waste rate", "Order accuracy"],
        benchmarks: [
          { metric: "Supplier on-time delivery", unit: "%", topQuartile: 98, median: 90, bottomQuartile: 75, source: "F&B benchmark 2025" },
          { metric: "Food waste rate", unit: "%", topQuartile: 3, median: 8, bottomQuartile: 15, source: "F&B benchmark 2025" },
        ],
      },
    ],
  },

  // ═══ MARKETING AGENCY ═══
  {
    id: "agency",
    name: "Marketing Agency / Creative Agency",
    description: "Digital marketing, creative, media buying, content",
    processes: [
      {
        id: "ag-campaign-delivery",
        name: "Campaign Delivery",
        aliases: ["campaign", "creative production", "media buying", "content creation"],
        description: "From client brief to campaign live and reporting",
        keywords: ["brief", "creative", "campaign", "ad", "content", "media", "approval", "launch", "report"],
        typicalSteps: [
          { order: 1, name: "Client brief", role: "Account Manager" },
          { order: 2, name: "Strategy + planning", role: "Strategist" },
          { order: 3, name: "Creative production", role: "Creative Team" },
          { order: 4, name: "Client review + approval", role: "Account Manager / Client" },
          { order: 5, name: "Campaign setup", role: "Media Buyer" },
          { order: 6, name: "Launch", role: "Media Buyer" },
          { order: 7, name: "Performance reporting", role: "Analyst" },
        ],
        typicalRoles: ["Account Manager", "Strategist", "Creative Team", "Media Buyer", "Analyst", "Client"],
        typicalFlows: [
          { from: "Account Manager", to: "Strategist", type: "handoff" },
          { from: "Strategist", to: "Creative Team", type: "demande" },
          { from: "Creative Team", to: "Account Manager", type: "livraison" },
          { from: "Account Manager", to: "Client", type: "validation" },
          { from: "Media Buyer", to: "Analyst", type: "information" },
        ],
        frequency: "weekly",
        avgDuration: "1-4 weeks",
        redFlags: ["brief to launch > 3 weeks", "client revision rounds > 3", "no performance report within 7 days", "scope creep undocumented"],
        kpis: ["Brief to launch time", "Client approval rounds", "Campaign ROAS", "Client retention rate"],
        benchmarks: [
          { metric: "Brief to launch time", unit: "days", topQuartile: 5, median: 14, bottomQuartile: 30, source: "Agency benchmark 2025" },
          { metric: "Client approval rounds", unit: "rounds", topQuartile: 1, median: 2.5, bottomQuartile: 5, source: "Agency benchmark 2025" },
          { metric: "Client retention rate", unit: "%", topQuartile: 90, median: 75, bottomQuartile: 55, source: "Agency benchmark 2025" },
          { metric: "Average ROAS", unit: "x", topQuartile: 5, median: 3, bottomQuartile: 1.5, source: "Digital marketing benchmark 2025" },
        ],
      },
      {
        id: "ag-client-reporting",
        name: "Client Reporting",
        aliases: ["monthly report", "performance report", "analytics", "dashboard"],
        description: "Regular performance reporting to clients",
        keywords: ["report", "analytics", "KPI", "performance", "dashboard", "monthly", "ROI"],
        typicalSteps: [
          { order: 1, name: "Data collection", role: "Analyst" },
          { order: 2, name: "Analysis + insights", role: "Analyst" },
          { order: 3, name: "Report creation", role: "Analyst / Designer" },
          { order: 4, name: "Internal review", role: "Account Manager" },
          { order: 5, name: "Client presentation", role: "Account Manager" },
        ],
        typicalRoles: ["Analyst", "Account Manager", "Designer", "Client"],
        typicalFlows: [
          { from: "Analyst", to: "Account Manager", type: "livraison" },
          { from: "Account Manager", to: "Client", type: "livraison" },
        ],
        frequency: "monthly",
        avgDuration: "2-5 days",
        redFlags: ["report delivery > 10 days after month end", "no actionable insights", "data errors in report"],
        kpis: ["Report delivery time", "Client satisfaction with reporting", "Insights per report"],
        benchmarks: [
          { metric: "Report delivery time (after month end)", unit: "days", topQuartile: 3, median: 7, bottomQuartile: 15, source: "Agency benchmark 2025" },
        ],
      },
    ],
  },
];

// Get all benchmarks from extended sectors
export function getAllExtendedBenchmarks(): { patternId: string; benchmarks: Benchmark[] }[] {
  return extendedSectors.flatMap((sector) =>
    sector.processes.map((process) => ({
      patternId: process.id,
      benchmarks: process.benchmarks,
    }))
  );
}

// Get total count
export function getExtendedStats() {
  const totalSectors = extendedSectors.length;
  const totalProcesses = extendedSectors.reduce((s, sec) => s + sec.processes.length, 0);
  const totalBenchmarks = extendedSectors.reduce((s, sec) =>
    s + sec.processes.reduce((b, p) => b + p.benchmarks.length, 0), 0
  );
  return { totalSectors, totalProcesses, totalBenchmarks };
}
