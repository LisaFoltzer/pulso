// Accounting Connector — Connects to Pennylane, QuickBooks, or Xero
// Reads salary data, invoices, and expenses to calculate real process costs
// Never writes or modifies any accounting data

export type AccountingProvider = "pennylane" | "quickbooks" | "xero" | "manual";

export type EmployeeCost = {
  role: string;
  department: string;
  annualSalary: number; // gross
  loadedHourlyCost: number; // salary + charges (45%) + overhead (15%) / 1607h per year
  source: AccountingProvider;
};

export type InvoiceData = {
  id: string;
  vendor: string;
  amount: number;
  date: string;
  category: string;
  linkedProcess?: string; // process name if identifiable
};

export type AccountingSnapshot = {
  provider: AccountingProvider;
  fetchedAt: string;
  employees: EmployeeCost[];
  monthlyRevenue: number;
  monthlyExpenses: number;
  recentInvoices: InvoiceData[];
  payrollTotal: number;
};

// Calculate loaded hourly cost from annual salary (French labor law)
// Formula: (Salary * 1.45 charges * 1.15 overhead) / 1607 legal hours per year
export function calculateLoadedHourlyCost(annualGrossSalary: number): number {
  const charges = 0.45; // employer charges in France (~45%)
  const overhead = 0.15; // office, tools, management overhead (~15%)
  const legalHoursPerYear = 1607; // 35h/week * 45.9 weeks (French law)

  const loadedAnnual = annualGrossSalary * (1 + charges) * (1 + overhead);
  return Math.round((loadedAnnual / legalHoursPerYear) * 100) / 100;
}

// Default salary ranges by role (France, 2026)
export const FRENCH_SALARY_RANGES: Record<string, { min: number; median: number; max: number }> = {
  "intern": { min: 12000, median: 14000, max: 16000 },
  "junior": { min: 28000, median: 33000, max: 38000 },
  "standard": { min: 35000, median: 42000, max: 50000 },
  "senior": { min: 45000, median: 55000, max: 65000 },
  "lead": { min: 55000, median: 65000, max: 80000 },
  "manager": { min: 60000, median: 75000, max: 95000 },
  "director": { min: 80000, median: 100000, max: 130000 },
  "c-level": { min: 100000, median: 140000, max: 200000 },
};

// Map role to salary level
export function inferSalaryLevel(role: string): string {
  const lower = role.toLowerCase();
  if (lower.includes("ceo") || lower.includes("cfo") || lower.includes("coo") || lower.includes("cto")) return "c-level";
  if (lower.includes("director") || lower.includes("vp")) return "director";
  if (lower.includes("head") || lower.includes("manager") || lower.includes("responsable")) return "manager";
  if (lower.includes("lead") || lower.includes("principal")) return "lead";
  if (lower.includes("senior") || lower.includes("sr")) return "senior";
  if (lower.includes("junior") || lower.includes("jr")) return "junior";
  if (lower.includes("intern") || lower.includes("stage") || lower.includes("alternance")) return "intern";
  return "standard";
}

// Calculate process cost using accounting data
export function calculateProcessCostFromAccounting(
  processName: string,
  roles: { label: string; department: string }[],
  hoursPerWeekByRole: Record<string, number>,
  accountingData?: AccountingSnapshot,
): {
  processName: string;
  monthlyTotalCost: number;
  costByRole: { role: string; hoursPerMonth: number; costPerMonth: number; source: string }[];
  annualCost: number;
  costAsPercentOfRevenue: number | null;
} {
  const costByRole = roles.map((role) => {
    const weeklyHours = hoursPerWeekByRole[role.label] || 0;
    const monthlyHours = weeklyHours * 4.33;

    // Try to get real cost from accounting data
    let hourlyCost: number;
    let source: string;

    const accountingEmployee = accountingData?.employees.find(
      (e) => e.role.toLowerCase().includes(role.label.toLowerCase()) ||
             e.department.toLowerCase().includes(role.department.toLowerCase())
    );

    if (accountingEmployee) {
      hourlyCost = accountingEmployee.loadedHourlyCost;
      source = `${accountingData?.provider} (real data)`;
    } else {
      const level = inferSalaryLevel(role.label);
      const salary = FRENCH_SALARY_RANGES[level]?.median || 42000;
      hourlyCost = calculateLoadedHourlyCost(salary);
      source = `Estimated (${level} level, France median)`;
    }

    return {
      role: role.label,
      hoursPerMonth: Math.round(monthlyHours * 10) / 10,
      costPerMonth: Math.round(monthlyHours * hourlyCost),
      source,
    };
  });

  const monthlyTotalCost = costByRole.reduce((s, r) => s + r.costPerMonth, 0);
  const annualCost = monthlyTotalCost * 12;

  const costAsPercentOfRevenue = accountingData?.monthlyRevenue
    ? Math.round((monthlyTotalCost / accountingData.monthlyRevenue) * 10000) / 100
    : null;

  return {
    processName,
    monthlyTotalCost,
    costByRole,
    annualCost,
    costAsPercentOfRevenue,
  };
}

// Format helpers
export function formatEUR(amount: number): string {
  if (Math.abs(amount) >= 1000000) return `${(amount / 1000000).toFixed(1)}M EUR`;
  if (Math.abs(amount) >= 1000) return `${(amount / 1000).toFixed(1)}K EUR`;
  return `${Math.round(amount)} EUR`;
}

export function formatPercentOfRevenue(percent: number | null): string {
  if (percent === null) return "N/A (connect accounting tool for real data)";
  return `${percent}% of monthly revenue`;
}
