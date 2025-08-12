import { LABEL_MAP, EXCLUDES } from '../constants/labelMap';
import { METRICS, type MetricId } from '../constants/metricsSchema';
import type { RawParsedMetric } from './parseOcrText';

export interface CanonicalMetric {
  id: MetricId;
  actual?: number;
  target?: number;
  percent?: number;
}

function isExcludedLabel(label: string): boolean {
  return EXCLUDES.some((re) => re.test(label));
}

function mapLabelToId(rawLabel: string): MetricId | undefined {
  for (const entry of LABEL_MAP) {
    if (entry.pattern.test(rawLabel)) return entry.id;
  }
  return undefined;
}

function enforceSpec(id: MetricId, raw: RawParsedMetric): CanonicalMetric | undefined {
  const spec = METRICS[id];
  if (!spec) return undefined;

  if (spec.valueType === 'percent') {
    // Only percent matters for percent-based metrics
    const percent = raw.percent;
    if (percent === undefined) return undefined; // nothing useful
    return { id, percent };
  }

  // Count-based metrics: keep actual; target only if expected
  const actual = raw.actual;
  const target = spec.hasTarget ? raw.target : undefined;

  if (actual === undefined && target === undefined) return undefined; // nothing useful
  return { id, actual, target };
}

function completenessScore(id: MetricId, m: CanonicalMetric): number {
  const spec = METRICS[id];
  if (spec.valueType === 'percent') {
    return m.percent !== undefined ? 1 : 0;
  }
  let score = 0;
  if (m.actual !== undefined) score += 1;
  if (m.target !== undefined) score += 1;
  return score;
}

/**
 * Convert RawParsedMetric[] into canonical, whitelisted metrics only.
 * - Drops excluded labels
 * - Maps label via LABEL_MAP → MetricId
 * - Enforces METRICS expectations (percent vs count, target expectation)
 * - Prefers the most complete record when duplicates exist
 */
export function canonicalizeMetrics(rawItems: RawParsedMetric[]): CanonicalMetric[] {
  const winners = new Map<MetricId, CanonicalMetric>();
  const order: MetricId[] = [];

  for (const raw of rawItems) {
    const label = raw.rawLabel || '';
    if (!label || isExcludedLabel(label)) continue;

    const id = mapLabelToId(label);
    if (!id) continue; // not mapped to a canonical metric

    const canonical = enforceSpec(id, raw);
    if (!canonical) continue; // nothing useful per spec

    if (!winners.has(id)) {
      winners.set(id, canonical);
      order.push(id);
      continue;
    }

    const current = winners.get(id)!;
    const currentScore = completenessScore(id, current);
    const newScore = completenessScore(id, canonical);
    if (newScore > currentScore) {
      winners.set(id, canonical);
      // keep original order
    }
  }

  return order.map((id) => winners.get(id)!) as CanonicalMetric[];
}
