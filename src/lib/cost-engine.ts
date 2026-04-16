// Cost Engine — Links processes to real financial data
// Calculates the true cost of each process, step, and bottleneck
// Can work with manual input or connected accounting tools

export type RoleCost = {
  roleId: string;
  label: string;
  hourlyCost: number; // EUR/hour (loaded cost: salary + charges + overhead)
  source: "manual" | "accounting" | "estimated";
};

export type ProcessCost = {
  processName: string;
  monthlyCost: number;
  costBreakdown: {
    stepName: string;
    role: string;
    hoursPerMonth: number;
    costPerMonth: number;
    valueLevel: "high" | "medium" | "low";
  }[];
  bottleneckCost: number | null; // cost of the bottleneck specifically
  automationSavings: number | null; // potential savings if automated
  benchmarkCost: number | null; // what this process costs at industry median
};

// Default hourly costs by role level (loaded cost = salary + 45% charges + overhead)
const DEFAULT_COSTS: Record<string, number> = {
  junior: 25,      // ~30K salary
  standard: 40,    // ~45K salary
  senior: 55,      // ~60K salary
  manager: 70,     // ~75K salary
  director: 95,    // ~100K salary
  executive: 130,  // ~140K salary
};

// Map role titles to cost levels
function getRoleCostLevel(role: string): string {
  const lower = role.toLowerCase();
  if (lower.includes("cfo") || lower.includes("ceo") || lower.includes("coo") || lower.includes("director")) return "executive";
  if (lower.includes("head") || lower.includes("vp") || lower.includes("lead")) return "director";
  if (lower.includes("manager") || lower.includes("responsable")) return "manager";
  if (lower.includes("senior") || lower.includes("specialist") || lower.includes("engineer")) return "senior";
  if (lower.includes("junior") || lower.includes("assistant") || lower.includes("intern")) return "junior";
  return "standard";
}

// Calculate process cost from time breakdown data
export function calculateProcessCost(
  processName: string,
  timeBreakdown: { category: string; hours: number; valueLevel: "high" | "medium" | "low"; role?: string }[],
  weeklyHours: number,
  roleCosts?: RoleCost[],
): ProcessCost {
  const breakdown = timeBreakdown.map((step) => {
    const monthlyHours = step.hours * 4.33; // weeks per month
    const level = getRoleCostLevel(step.role || "standard");
    const customCost = roleCosts?.find((r) => r.label.toLowerCase().includes((step.role || "").toLowerCase()));
    const hourlyCost = customCost?.hourlyCost || DEFAULT_COSTS[level] || DEFAULT_COSTS.standard;

    return {
      stepName: step.category,
      role: step.role || "Unknown",
      hoursPerMonth: Math.round(monthlyHours * 10) / 10,
      costPerMonth: Math.round(monthlyHours * hourlyCost),
      valueLevel: step.valueLevel,
    };
  });

  const monthlyCost = breakdown.reduce((s, b) => s + b.costPerMonth, 0);
  const bottleneckCost = breakdown.filter((b) => b.valueLevel === "low").reduce((s, b) => s + b.costPerMonth, 0);
  const automationSavings = Math.round(bottleneckCost * 0.7); // assume 70% of low-value cost is automatable

  return {
    processName,
    monthlyCost,
    costBreakdown: breakdown,
    bottleneckCost: bottleneckCost > 0 ? bottleneckCost : null,
    automationSavings: automationSavings > 0 ? automationSavings : null,
    benchmarkCost: null, // filled when benchmarks are available
  };
}

// Format cost as EUR
export function formatCost(amount: number): string {
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K EUR`;
  return `${amount} EUR`;
}

// Calculate total company process cost
export function calculateTotalCost(processes: ProcessCost[]): {
  totalMonthly: number;
  totalBottleneckCost: number;
  totalSavingsPotential: number;
  costByValueLevel: { high: number; medium: number; low: number };
} {
  const totalMonthly = processes.reduce((s, p) => s + p.monthlyCost, 0);
  const totalBottleneckCost = processes.reduce((s, p) => s + (p.bottleneckCost || 0), 0);
  const totalSavingsPotential = processes.reduce((s, p) => s + (p.automationSavings || 0), 0);

  const costByValueLevel = { high: 0, medium: 0, low: 0 };
  for (const p of processes) {
    for (const step of p.costBreakdown) {
      costByValueLevel[step.valueLevel] += step.costPerMonth;
    }
  }

  return { totalMonthly, totalBottleneckCost, totalSavingsPotential, costByValueLevel };
}
