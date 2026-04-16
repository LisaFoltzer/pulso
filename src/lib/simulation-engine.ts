// Simulation Engine — "What if" scenarios for process optimization
// Allows the CEO to simulate changes and see projected impact

export type SimulationScenario = {
  id: string;
  name: string;
  description: string;
  changes: SimulationChange[];
  projectedImpact: SimulationImpact;
};

export type SimulationChange = {
  type: "remove_step" | "automate_step" | "add_person" | "merge_steps" | "change_threshold" | "add_tool";
  target: string; // step name, role name, or process name
  details: string;
};

export type SimulationImpact = {
  timeSavedPerMonth: number; // hours
  costSavedPerMonth: number; // EUR
  scoreChange: number; // +/- points on health score
  riskLevel: "low" | "medium" | "high";
  implementationEffort: "low" | "medium" | "high";
  implementationTime: string; // "1 week", "1 month", etc.
  sideEffects: string[]; // potential downsides
};

// Pre-built simulation scenarios based on common bottleneck types
export const simulationTemplates: Record<string, (processName: string, currentScore: number, bottleneckDetails: string) => SimulationScenario[]> = {

  // When bottleneck is a validation/approval step
  validation_bottleneck: (processName, currentScore, bottleneckDetails) => [
    {
      id: "sim-auto-validate",
      name: "Auto-validate below threshold",
      description: `Remove manual validation for low-risk items in ${processName}`,
      changes: [
        { type: "automate_step", target: bottleneckDetails, details: "Auto-approve items below configured threshold" },
        { type: "change_threshold", target: "validation_threshold", details: "Set threshold at typical 80th percentile" },
      ],
      projectedImpact: {
        timeSavedPerMonth: 12,
        costSavedPerMonth: 840,
        scoreChange: +15,
        riskLevel: "low",
        implementationEffort: "low",
        implementationTime: "1 week",
        sideEffects: ["Requires audit trail for compliance", "Need exception handling for edge cases"],
      },
    },
    {
      id: "sim-parallel-validate",
      name: "Parallel validation",
      description: `Run validation in parallel with next step instead of blocking`,
      changes: [
        { type: "merge_steps", target: bottleneckDetails, details: "Start next step immediately, validate in background" },
      ],
      projectedImpact: {
        timeSavedPerMonth: 8,
        costSavedPerMonth: 560,
        scoreChange: +10,
        riskLevel: "medium",
        implementationEffort: "medium",
        implementationTime: "2 weeks",
        sideEffects: ["Need rollback mechanism if validation fails", "Slightly more complex workflow"],
      },
    },
    {
      id: "sim-delegate-validate",
      name: "Delegate to lower level",
      description: `Move validation responsibility from ${bottleneckDetails} to a more available role`,
      changes: [
        { type: "add_person", target: bottleneckDetails, details: "Delegate to team lead instead of director" },
      ],
      projectedImpact: {
        timeSavedPerMonth: 10,
        costSavedPerMonth: 700,
        scoreChange: +12,
        riskLevel: "low",
        implementationEffort: "low",
        implementationTime: "1 day",
        sideEffects: ["Director loses visibility — add weekly summary report", "Team lead needs training on criteria"],
      },
    },
  ],

  // When bottleneck is a single person handling too much
  concentration_bottleneck: (processName, currentScore, bottleneckDetails) => [
    {
      id: "sim-hire",
      name: "Hire additional person",
      description: `Add a second person to handle ${bottleneckDetails}`,
      changes: [
        { type: "add_person", target: bottleneckDetails, details: "Hire or reassign someone to share the workload" },
      ],
      projectedImpact: {
        timeSavedPerMonth: 20,
        costSavedPerMonth: -3500, // negative = costs money
        scoreChange: +20,
        riskLevel: "low",
        implementationEffort: "high",
        implementationTime: "1-3 months",
        sideEffects: ["Increases headcount cost by ~3.5K EUR/month", "Need onboarding time", "But eliminates single point of failure"],
      },
    },
    {
      id: "sim-redistribute",
      name: "Redistribute workload",
      description: `Move some tasks from ${bottleneckDetails} to other team members`,
      changes: [
        { type: "merge_steps", target: bottleneckDetails, details: "Identify tasks that can be handled by adjacent roles" },
      ],
      projectedImpact: {
        timeSavedPerMonth: 12,
        costSavedPerMonth: 0, // no direct cost change
        scoreChange: +12,
        riskLevel: "medium",
        implementationEffort: "medium",
        implementationTime: "2 weeks",
        sideEffects: ["Adjacent roles need training", "May temporarily slow down during transition", "Reduces bus factor risk"],
      },
    },
    {
      id: "sim-automate-low-value",
      name: "Automate low-value tasks",
      description: `Automate repetitive tasks currently done by ${bottleneckDetails}`,
      changes: [
        { type: "automate_step", target: bottleneckDetails, details: "Identify and automate tasks that don't require human judgment" },
        { type: "add_tool", target: "automation", details: "Deploy n8n workflow for identified tasks" },
      ],
      projectedImpact: {
        timeSavedPerMonth: 15,
        costSavedPerMonth: 600,
        scoreChange: +15,
        riskLevel: "low",
        implementationEffort: "medium",
        implementationTime: "2-4 weeks",
        sideEffects: ["Requires tool setup (n8n/Make)", "One-time development cost", "Frees person for high-value work"],
      },
    },
  ],

  // When bottleneck is slow handoffs between teams
  handoff_bottleneck: (processName, currentScore, bottleneckDetails) => [
    {
      id: "sim-auto-handoff",
      name: "Automated handoff",
      description: `Automate the handoff between teams in ${processName}`,
      changes: [
        { type: "automate_step", target: bottleneckDetails, details: "Trigger next step automatically when previous completes" },
        { type: "add_tool", target: "notification", details: "Add Slack notification to next person in line" },
      ],
      projectedImpact: {
        timeSavedPerMonth: 10,
        costSavedPerMonth: 500,
        scoreChange: +12,
        riskLevel: "low",
        implementationEffort: "low",
        implementationTime: "1 week",
        sideEffects: ["Need to define clear 'done' criteria for each step", "Requires tool integration"],
      },
    },
    {
      id: "sim-shared-ownership",
      name: "Shared ownership",
      description: `Create cross-functional pods instead of sequential handoffs`,
      changes: [
        { type: "merge_steps", target: bottleneckDetails, details: "Combine teams into a pod that owns the full process" },
      ],
      projectedImpact: {
        timeSavedPerMonth: 16,
        costSavedPerMonth: 800,
        scoreChange: +18,
        riskLevel: "medium",
        implementationEffort: "high",
        implementationTime: "1-2 months",
        sideEffects: ["Requires organizational change", "May face resistance", "But dramatically reduces wait times"],
      },
    },
  ],
};

// Generate simulation scenarios for a detected bottleneck
export function generateSimulations(
  processName: string,
  currentScore: number,
  bottleneckType: "validation" | "concentration" | "handoff" | "general",
  bottleneckDetails: string,
): SimulationScenario[] {
  const templateKey = `${bottleneckType}_bottleneck`;
  const template = simulationTemplates[templateKey];

  if (template) {
    return template(processName, currentScore, bottleneckDetails);
  }

  // Generic fallback scenarios
  return [
    {
      id: "sim-generic-automate",
      name: "Automate the bottleneck",
      description: `Deploy automation for ${bottleneckDetails} in ${processName}`,
      changes: [{ type: "automate_step", target: bottleneckDetails, details: "Automate using n8n or similar" }],
      projectedImpact: {
        timeSavedPerMonth: 10,
        costSavedPerMonth: 500,
        scoreChange: +10,
        riskLevel: "low",
        implementationEffort: "medium",
        implementationTime: "2 weeks",
        sideEffects: ["Requires tool setup"],
      },
    },
    {
      id: "sim-generic-redesign",
      name: "Redesign the process",
      description: `Rethink the flow around ${bottleneckDetails}`,
      changes: [{ type: "remove_step", target: bottleneckDetails, details: "Eliminate or simplify the problematic step" }],
      projectedImpact: {
        timeSavedPerMonth: 15,
        costSavedPerMonth: 800,
        scoreChange: +15,
        riskLevel: "medium",
        implementationEffort: "high",
        implementationTime: "1 month",
        sideEffects: ["Requires team buy-in", "May disrupt current workflow temporarily"],
      },
    },
  ];
}

// Calculate total impact of multiple simulations
export function calculateCombinedImpact(scenarios: SimulationScenario[]): {
  totalTimeSaved: number;
  totalCostSaved: number;
  avgScoreImprovement: number;
  highestRisk: string;
} {
  const totalTimeSaved = scenarios.reduce((s, sc) => s + sc.projectedImpact.timeSavedPerMonth, 0);
  const totalCostSaved = scenarios.reduce((s, sc) => s + sc.projectedImpact.costSavedPerMonth, 0);
  const avgScoreImprovement = Math.round(scenarios.reduce((s, sc) => s + sc.projectedImpact.scoreChange, 0) / scenarios.length);

  const riskLevels = { low: 1, medium: 2, high: 3 };
  const highestRisk = scenarios.reduce((max, sc) =>
    riskLevels[sc.projectedImpact.riskLevel] > riskLevels[max as keyof typeof riskLevels]
      ? sc.projectedImpact.riskLevel
      : max,
    "low"
  );

  return { totalTimeSaved, totalCostSaved, avgScoreImprovement, highestRisk };
}
