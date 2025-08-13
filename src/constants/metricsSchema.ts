// Canonical Metrics Whitelist
// Only these metrics are allowed to flow OCR → Modal → Save.

export type MetricId =
  | 'cv'            // Core Voice / New Lines
  | 'bts'           // BTS Activations
  | 'tfb'           // TFB Activations
  | 'app'           // App average (2 dp)
  | 'p360Attach'    // Protection 360 attach percent (1 dp)
  | 'csat'          // CSAT average (1–10 scale, 2 dp)
  | 'salesQuality'; // Sales Quality percent (1 dp)

export type MetricValueKind =
  | 'count'          // plain count (not used in current whitelist)
  | 'percent'        // single percent value
  | 'float'          // single floating-point average
  | 'count_percent'; // actual, target, percent (and optional mtdOppy)

export interface MetricSpec {
  // Human-friendly label for display contexts (if ever needed)
  label: string;
  // Nature of the value captured for the metric
  valueType: MetricValueKind;
  // Whether a target (goal) should be captured (only relevant for countTargetPercent)
  hasTarget?: boolean;
  // Whether we should capture Month-To-Date Opportunity
  hasMtdOppy?: boolean;
  // Decimal places for rounding (percent/average)
  decimals?: number;
  // For averages like CSAT, enforce min/max range
  min?: number;
  max?: number;
}

export const METRICS: Record<MetricId, MetricSpec> = {
  cv: {
    label: 'Voice Activations',
    valueType: 'count_percent',
    hasTarget: true,
    hasMtdOppy: true,
    decimals: 1, // percent 1 dp
  },
  bts: {
    label: 'BTS Activations',
    valueType: 'count_percent',
    hasTarget: true,
    hasMtdOppy: true,
    decimals: 1,
  },
  tfb: {
    label: 'TFB Activations',
    valueType: 'count_percent',
    hasTarget: true,
    hasMtdOppy: true,
    decimals: 1,
  },
  app: {
    label: 'App Average',
    valueType: 'float',
    hasTarget: false,
    decimals: 2,
  },
  p360Attach: {
    label: 'P360 Attach %',
    valueType: 'percent',
    hasTarget: false,
    decimals: 1,
  },
  csat: {
    label: 'CSAT (1–10 Avg)',
    valueType: 'float',
    hasTarget: false,
    decimals: 2,
    min: 1,
    max: 10,
  },
  salesQuality: {
    label: 'Sales Quality %',
    valueType: 'percent',
    hasTarget: false,
    decimals: 1,
  },
};
