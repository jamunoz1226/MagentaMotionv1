// Utility functions for catch-up calculations
export interface MetricInput {
  code: string;
  actual: number;
  mtdOppty: number;
  dataThroughDay: number;
  shiftsLeft: number;
  catchUpDay: number;
  salesQualityPct?: number;
  csatCount?: number;
  csatTotalScore?: number;
}

export interface MetricCalculation {
  code: string;
  name: string;
  actual: number;
  mtdOppty: number;
  deficit: number;
  eomExpected: number;
  perShiftToCatchUp: number;
  priorityScore: number;
  status: 'On Track' | 'Needs Focus' | 'Critical';
}

// Metric weights for priority calculation
const METRIC_WEIGHTS: Record<string, number> = {
  CV: 10,
  BTS: 5,
  TFB: 3,
  P360: 3,
  APP: 7,
  CSAT: 3,
  SALES_QUALITY: 7,
};

// Metric display names
const METRIC_NAMES: Record<string, string> = {
  CV: 'Customer Value',
  BTS: 'Back to School',
  TFB: 'Time to First Byte',
  P360: 'Product 360',
  APP: 'Application Performance',
  CSAT: 'Customer Satisfaction',
  SALES_QUALITY: 'Sales Quality',
};

/**
 * Calculate deficit for a metric
 */
export function calculateDeficit(input: MetricInput): number {
  const { code, actual, mtdOppty, salesQualityPct, csatCount, csatTotalScore } = input;
  
  if (code === 'SALES_QUALITY') {
    if (salesQualityPct !== undefined) {
      return salesQualityPct - actual;
    }
    return Math.max(0, 100 - actual);
  }
  
  if (code === 'CSAT' && csatCount && csatTotalScore) {
    const csatActual = csatTotalScore / csatCount;
    return mtdOppty - csatActual;
  }
  
  return mtdOppty - actual;
}

/**
 * Calculate EOM expected value
 */
export function calculateEomExpected(input: MetricInput): number {
  const { mtdOppty, dataThroughDay } = input;
  
  if (dataThroughDay === 0) return 0;
  
  return (mtdOppty / dataThroughDay) * 30;
}

/**
 * Calculate per-shift to catch up
 */
export function calculatePerShiftToCatchUp(input: MetricInput): number {
  const { mtdOppty, dataThroughDay, catchUpDay, actual, shiftsLeft } = input;
  
  if (shiftsLeft === 0 || dataThroughDay === 0) return 0;
  
  const projectedToCatchUpDay = (mtdOppty / dataThroughDay) * catchUpDay;
  return (projectedToCatchUpDay - actual) / shiftsLeft;
}

/**
 * Calculate priority score
 */
export function calculatePriorityScore(deficit: number, code: string): number {
  const weight = METRIC_WEIGHTS[code] || 1;
  return deficit * weight;
}

/**
 * Determine status based on deficit
 */
export function getMetricStatus(deficit: number): 'On Track' | 'Needs Focus' | 'Critical' {
  if (deficit < 0) return 'On Track';
  if (deficit <= 5) return 'Needs Focus';
  return 'Critical';
}

/**
 * Get metric display name
 */
export function getMetricName(code: string): string {
  return METRIC_NAMES[code] || code;
}

/**
 * Calculate all metrics for a given input
 */
export function calculateMetric(input: MetricInput): MetricCalculation {
  const deficit = calculateDeficit(input);
  const eomExpected = calculateEomExpected(input);
  const perShiftToCatchUp = calculatePerShiftToCatchUp(input);
  const priorityScore = calculatePriorityScore(deficit, input.code);
  const status = getMetricStatus(deficit);
  
  return {
    code: input.code,
    name: getMetricName(input.code),
    actual: input.actual,
    mtdOppty: input.mtdOppty,
    deficit,
    eomExpected,
    perShiftToCatchUp,
    priorityScore,
    status,
  };
}

/**
 * Sort metrics by gap (deficit) or priority
 */
export function sortMetrics(
  metrics: MetricCalculation[],
  sortBy: 'gap' | 'priority'
): MetricCalculation[] {
  return [...metrics].sort((a, b) => {
    if (sortBy === 'gap') {
      return b.deficit - a.deficit; // Largest deficit first
    }
    return b.priorityScore - a.priorityScore; // Highest priority first
  });
}

/**
 * Calculate overall progress percentage
 */
export function calculateOverallProgress(metrics: MetricCalculation[]): number {
  if (metrics.length === 0) return 0;
  
  const totalActual = metrics.reduce((sum, metric) => sum + metric.actual, 0);
  const totalTarget = metrics.reduce((sum, metric) => sum + metric.mtdOppty, 0);
  
  if (totalTarget === 0) return 0;
  
  return Math.round((totalActual / totalTarget) * 100);
}

/**
 * Get formula description for tooltips
 */
export function getFormulaDescription(field: string): string {
  switch (field) {
    case 'deficit':
      return 'Deficit = MTD Opportunity - Actual';
    case 'eomExpected':
      return 'EOM Expected = (MTD Opportunity ÷ Data Through Day) × 30';
    case 'perShiftToCatchUp':
      return 'Per-Shift to Catch Up = (((MTD Opportunity ÷ Data Through Day) × Catch-Up Day) - Actual) ÷ Shifts Left';
    case 'priorityScore':
      return 'Priority Score = Deficit × Weight';
    default:
      return '';
  }
}