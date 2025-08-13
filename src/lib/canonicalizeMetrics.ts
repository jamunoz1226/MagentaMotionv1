import { LABEL_MAP, EXCLUDES } from '../constants/labelMap';
import { METRICS, type MetricId } from '../constants/metricsSchema';
import type { RawParsedMetric } from './parseOcrText';

export interface CanonicalMetric {
  id: MetricId;
  actual?: number;
  target?: number;
  percent?: number; // stored as number
  avg?: number; // for averages like app or csat
  mtdOppy?: number; // Month-To-Date Opportunity
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

function roundTo(value: number | undefined, decimals: number): number | undefined {
  if (value === undefined) return value;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function roundInt(value: number | undefined): number | undefined {
  if (value === undefined) return value;
  return Math.round(value);
}

function roundPercent(value: number | undefined): number | undefined {
  return roundTo(value, 1);
}

function roundAvg(value: number | undefined): number | undefined {
  return roundTo(value, 2);
}

function enforceSpec(id: MetricId, raw: RawParsedMetric): CanonicalMetric | undefined {
  const spec = METRICS[id];
  if (!spec) return undefined;

  if (spec.valueType === 'percent') {
    const percent = roundPercent(raw.percent);
    if (percent === undefined) return undefined;
    return { id, percent };
  }

  if (spec.valueType === 'float') {
    const avg = roundAvg(raw.avg);
    if (avg === undefined) return undefined;
    return { id, avg };
  }

  // count_percent (cv/bts/tfb)
  const actual = roundInt(raw.actual);
  const target = spec.hasTarget ? roundInt(raw.target) : undefined;
  const percent = roundPercent(raw.percent);
  const mtdOppy = roundInt(raw.mtdOppy);

  if (
    actual === undefined &&
    target === undefined &&
    percent === undefined &&
    mtdOppy === undefined
  ) {
    return undefined;
  }
  return { id, actual, target, percent, mtdOppy };
}

function completenessScore(id: MetricId, m: CanonicalMetric): number {
  const spec = METRICS[id];
  if (spec.valueType === 'percent') return m.percent !== undefined ? 1 : 0;
  if (spec.valueType === 'float') return m.avg !== undefined ? 1 : 0;
  let score = 0;
  if (m.actual !== undefined) score += 1;
  if (m.target !== undefined) score += 1;
  if (m.percent !== undefined) score += 1;
  if (m.mtdOppy !== undefined) score += 1;
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

export function pickOppyMap(items: CanonicalMetric[]): Record<MetricId, number> {
  const oppy: Partial<Record<MetricId, number>> = {};
  for (const item of items) {
    if (item.mtdOppy !== undefined) {
      oppy[item.id] = item.mtdOppy;
    }
  }
  return oppy as Record<MetricId, number>;
}
