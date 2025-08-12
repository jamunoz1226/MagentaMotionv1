// Canonical Metrics Whitelist
// Only these metrics are allowed to flow OCR → Modal → Save.

export type MetricId =
  | 'voice'
  | 'bts'
  | 'tfb'
  | 'p360'
  | 'accessories'
  | 'devicesSold'
  | 'surveyScore'
  | 'surveyCount';

export type MetricValueKind = 'count' | 'percent';

export interface MetricSpec {
  // Human-friendly label for display contexts (if ever needed)
  label: string;
  // Nature of the value captured for the metric
  valueType: MetricValueKind;
  // Whether we expect a target (goal) to be provided and tracked
  hasTarget: boolean;
}

export const METRICS: Record<MetricId, MetricSpec> = {
  voice: {
    label: 'Voice Activations',
    valueType: 'count',
    hasTarget: true,
  },
  bts: {
    label: 'BTS Activations',
    valueType: 'count',
    hasTarget: true,
  },
  tfb: {
    label: 'TFB Activations',
    valueType: 'count',
    hasTarget: true,
  },
  p360: {
    label: 'P360 Sold',
    valueType: 'count',
    hasTarget: true,
  },
  accessories: {
    label: 'Accessories Sold',
    valueType: 'count',
    hasTarget: true,
  },
  devicesSold: {
    label: 'Devices Sold',
    valueType: 'count',
    hasTarget: true,
  },
  surveyScore: {
    label: 'Survey Score (Avg)',
    // This is an average score captured as a percentage-like value (0-100 scale)
    valueType: 'percent',
    // We do not track a target in the shift store for avg score directly; we store running total and count
    hasTarget: false,
  },
  surveyCount: {
    label: 'Survey Responses',
    valueType: 'count',
    hasTarget: false,
  },
};
