import type { MetricId } from './metricsSchema';

export type LabelMapEntry = { pattern: RegExp; id: MetricId };

export const LABEL_MAP: LabelMapEntry[] = [
  { pattern: /\b(cv|consumer\sphones?)\b/i, id: 'cv' },
  { pattern: /\bbts\b/i, id: 'bts' },
  { pattern: /\btfb\b/i, id: 'tfb' },
  { pattern: /\b(app|accessories\sper\sphone)\b/i, id: 'app' },
  { pattern: /\b(p360|protection\s360|insurance)\s(attach|rate)?\b/i, id: 'p360Attach' },
  { pattern: /\b(csat|customer\ssatisfaction)\b/i, id: 'csat' },
  { pattern: /\bsales\squality\b/i, id: 'salesQuality' },
];

export const EXCLUDES: RegExp[] = [
  /total\s*revenue/i,
  /\barpu\b/i,
];
