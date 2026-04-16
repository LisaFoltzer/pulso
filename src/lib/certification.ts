// Process Certification System — Gamification + proof of quality
// Processes earn badges based on their health scores and consistency

export type CertificationLevel = "none" | "bronze" | "silver" | "gold" | "platinum";

export type ProcessCertification = {
  processName: string;
  level: CertificationLevel;
  score: number;
  streakWeeks: number; // consecutive weeks at this level
  earnedDate: string | null;
  nextLevel: CertificationLevel | null;
  nextLevelRequirement: string | null;
  badges: Badge[];
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  earnedDate: string;
  icon: string; // CSS class or identifier
};

// Certification thresholds
const LEVELS: { level: CertificationLevel; minScore: number; minStreak: number; color: string; label: string }[] = [
  { level: "platinum", minScore: 95, minStreak: 12, color: "#E5E5E5", label: "Platinum" },
  { level: "gold", minScore: 90, minStreak: 8, color: "#EAB308", label: "Gold" },
  { level: "silver", minScore: 80, minStreak: 4, color: "#94A3B8", label: "Silver" },
  { level: "bronze", minScore: 70, minStreak: 2, color: "#CD7F32", label: "Bronze" },
  { level: "none", minScore: 0, minStreak: 0, color: "#525252", label: "Not certified" },
];

// Available badges
const BADGE_DEFINITIONS = [
  { id: "first-audit", name: "First Audit", description: "Completed your first process audit", condition: "first_analysis" },
  { id: "bottleneck-killer", name: "Bottleneck Killer", description: "Resolved a detected bottleneck", condition: "bottleneck_resolved" },
  { id: "speed-demon", name: "Speed Demon", description: "Process duration improved by 50%+", condition: "duration_halved" },
  { id: "consistency-king", name: "Consistency King", description: "Maintained score > 85 for 4+ weeks", condition: "streak_4_weeks" },
  { id: "automation-pioneer", name: "Automation Pioneer", description: "Deployed your first automation", condition: "first_automation" },
  { id: "benchmark-beater", name: "Benchmark Beater", description: "Exceeded industry median on all metrics", condition: "above_median_all" },
  { id: "team-player", name: "Team Player", description: "No single-point-of-failure detected", condition: "no_spof" },
  { id: "data-driven", name: "Data Driven", description: "100% of metrics are measured, not estimated", condition: "all_measured" },
  { id: "full-coverage", name: "Full Coverage", description: "All core processes detected and scored", condition: "all_processes_scored" },
  { id: "sparring-champion", name: "Sparring Champion", description: "Completed 10+ Sparring Partner sessions", condition: "sparring_10" },
];

// Determine certification level for a process
export function getCertificationLevel(score: number, streakWeeks: number): CertificationLevel {
  for (const level of LEVELS) {
    if (score >= level.minScore && streakWeeks >= level.minStreak) {
      return level.level;
    }
  }
  return "none";
}

// Get level config
export function getLevelConfig(level: CertificationLevel) {
  return LEVELS.find((l) => l.level === level) || LEVELS[LEVELS.length - 1];
}

// Get next level requirements
export function getNextLevel(currentLevel: CertificationLevel): { level: CertificationLevel; requirement: string } | null {
  const currentIndex = LEVELS.findIndex((l) => l.level === currentLevel);
  if (currentIndex <= 0) return null; // already at platinum or not found

  const next = LEVELS[currentIndex - 1];
  return {
    level: next.level,
    requirement: `Score >= ${next.minScore} for ${next.minStreak}+ consecutive weeks`,
  };
}

// Calculate certification for a process
export function calculateCertification(
  processName: string,
  currentScore: number,
  weeklyScores: number[], // last N weeks of scores
): ProcessCertification {
  // Calculate streak at current level
  let streakWeeks = 0;
  for (let i = weeklyScores.length - 1; i >= 0; i--) {
    if (weeklyScores[i] >= currentScore - 5) { // allow 5-point tolerance
      streakWeeks++;
    } else {
      break;
    }
  }

  const level = getCertificationLevel(currentScore, streakWeeks);
  const nextLevelInfo = getNextLevel(level);

  return {
    processName,
    level,
    score: currentScore,
    streakWeeks,
    earnedDate: level !== "none" ? new Date().toISOString() : null,
    nextLevel: nextLevelInfo?.level || null,
    nextLevelRequirement: nextLevelInfo?.requirement || null,
    badges: [], // filled from user activity
  };
}

// Check which badges a user has earned
export function checkBadges(context: {
  hasFirstAnalysis: boolean;
  bottlenecksResolved: number;
  durationImprovements: { processName: string; improvement: number }[];
  streaks: { processName: string; weeks: number; minScore: number }[];
  automationsDeployed: number;
  benchmarkResults: { allAboveMedian: boolean };
  spofDetected: boolean;
  allMeasured: boolean;
  allProcessesScored: boolean;
  sparringSessions: number;
}): Badge[] {
  const earned: Badge[] = [];
  const now = new Date().toISOString();

  if (context.hasFirstAnalysis) {
    earned.push({ id: "first-audit", name: "First Audit", description: "Completed your first process audit", earnedDate: now, icon: "audit" });
  }
  if (context.bottlenecksResolved > 0) {
    earned.push({ id: "bottleneck-killer", name: "Bottleneck Killer", description: "Resolved a detected bottleneck", earnedDate: now, icon: "bottleneck" });
  }
  if (context.durationImprovements.some((d) => d.improvement >= 50)) {
    earned.push({ id: "speed-demon", name: "Speed Demon", description: "Process duration improved by 50%+", earnedDate: now, icon: "speed" });
  }
  if (context.streaks.some((s) => s.weeks >= 4 && s.minScore >= 85)) {
    earned.push({ id: "consistency-king", name: "Consistency King", description: "Maintained score > 85 for 4+ weeks", earnedDate: now, icon: "consistency" });
  }
  if (context.automationsDeployed > 0) {
    earned.push({ id: "automation-pioneer", name: "Automation Pioneer", description: "Deployed your first automation", earnedDate: now, icon: "automation" });
  }
  if (context.benchmarkResults.allAboveMedian) {
    earned.push({ id: "benchmark-beater", name: "Benchmark Beater", description: "Exceeded industry median on all metrics", earnedDate: now, icon: "benchmark" });
  }
  if (!context.spofDetected) {
    earned.push({ id: "team-player", name: "Team Player", description: "No single-point-of-failure detected", earnedDate: now, icon: "team" });
  }
  if (context.allMeasured) {
    earned.push({ id: "data-driven", name: "Data Driven", description: "100% of metrics are measured, not estimated", earnedDate: now, icon: "data" });
  }
  if (context.allProcessesScored) {
    earned.push({ id: "full-coverage", name: "Full Coverage", description: "All core processes detected and scored", earnedDate: now, icon: "coverage" });
  }
  if (context.sparringSessions >= 10) {
    earned.push({ id: "sparring-champion", name: "Sparring Champion", description: "Completed 10+ Sparring Partner sessions", earnedDate: now, icon: "sparring" });
  }

  return earned;
}

// Get all badge definitions for display
export function getAllBadgeDefinitions() {
  return BADGE_DEFINITIONS;
}
