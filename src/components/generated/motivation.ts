/**
 * Motivation utility for shift tracking
 * Provides encouraging nudges based on metric progress
 */

export type MetricCode = 'voice' | 'bts' | 'tfb' | 'p360' | 'acc' | 'devices' | 'csat';

/**
 * Get an encouraging nudge message for a specific metric
 * @param metricCode - The metric identifier
 * @param remaining - Number remaining to reach goal
 * @returns Motivational message string
 */
export function getNudge(metricCode: MetricCode, remaining: number): string {
  const nudges: Record<MetricCode, string> = {
    voice: `Strong conversations = strong wins. ${remaining} to go.`,
    bts: `Trade-ins unlock upgrades—${remaining} left.`,
    tfb: `Business lines build big days—${remaining} more.`,
    p360: `Protect every device—${remaining} to your goal.`,
    acc: `Add the essentials—${remaining} to go.`,
    devices: `One more device makes a difference—${remaining}.`,
    csat: remaining > 0 
      ? `Great service shows—aim for every survey.`
      : `Amazing service scores—keep it up!`
  };

  return nudges[metricCode] || `Keep pushing—${remaining} to go!`;
}

/**
 * Get a celebration message when a goal is reached
 * @param metricCode - The metric identifier
 * @returns Celebration message string
 */
export function getCelebration(metricCode: MetricCode): string {
  const celebrations: Record<MetricCode, string> = {
    voice: "Voice goal crushed! 🎯",
    bts: "Trade-in target hit! 📱",
    tfb: "Business lines complete! 💼",
    p360: "Protection goals achieved! 🛡️",
    acc: "Accessory targets met! ⚡",
    devices: "Device goals reached! 📱",
    csat: "Service excellence! ⭐"
  };

  return celebrations[metricCode] || "Goal achieved! 🎉";
}

/**
 * Get a progress-based encouragement
 * @param metricCode - The metric identifier
 * @param progressPct - Progress percentage (0-100)
 * @returns Progress-based message string
 */
export function getProgressNudge(metricCode: MetricCode, progressPct: number): string {
  if (progressPct >= 100) {
    return getCelebration(metricCode);
  }
  
  if (progressPct >= 80) {
    return `Almost there! You're ${Math.round(progressPct)}% to your ${metricCode.toUpperCase()} goal.`;
  }
  
  if (progressPct >= 50) {
    return `Halfway there! Keep the momentum going on ${metricCode.toUpperCase()}.`;
  }
  
  return `Strong start! ${Math.round(progressPct)}% progress on ${metricCode.toUpperCase()}.`;
}

/**
 * Get a random motivational phrase for general encouragement
 * @returns Random motivational message
 */
export function getRandomMotivation(): string {
  const motivations = [
    "Every interaction counts! 💪",
    "You're building something great! 🚀",
    "Consistency creates champions! ⭐",
    "One step closer to excellence! 🎯",
    "Your effort shows in every metric! 📈",
    "Progress over perfection! ✨",
    "Making it happen, one goal at a time! 🔥"
  ];
  
  return motivations[Math.floor(Math.random() * motivations.length)];
}