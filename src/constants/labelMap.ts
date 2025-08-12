import type { MetricId } from './metricsSchema';

export type LabelMapEntry = { pattern: RegExp; id: MetricId };

export const LABEL_MAP: LabelMapEntry[] = [
  // Activations
  { pattern: /\bnew\s*lines?\b/i, id: 'voice' },
  { pattern: /\bbts\b/i, id: 'bts' },
  { pattern: /\btfb\b/i, id: 'tfb' },

  // Incremental
  { pattern: /\b(p360|protection\s*360|insurance)\b/i, id: 'p360' },
  { pattern: /\baccessories\b/i, id: 'accessories' },
  { pattern: /\b(device\s*sales|devices)\b/i, id: 'devicesSold' },

  // Surveys
  { pattern: /\b(csat|survey\s*score)\b/i, id: 'surveyScore' },
  { pattern: /\b(surveys|survey\s*count)\b/i, id: 'surveyCount' },
];

export const EXCLUDES: RegExp[] = [
  /total\s*revenue/i,
  /\barpu\b/i,
];
