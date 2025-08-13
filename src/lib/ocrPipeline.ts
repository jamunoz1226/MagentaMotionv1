import type { MetricId } from '../constants/metricsSchema';
import { parseOcrText, type RawParsedMetric } from './parseOcrText';
import {
  canonicalizeMetrics,
  pickOppyMap,
  type CanonicalMetric,
} from './canonicalizeMetrics';

export interface OcrPipelineResult {
  metrics: CanonicalMetric[]; // entries may include avg, percent, mtdOppy
  oppyById: Record<MetricId, number>;
}

export function canonicalizeOcrText(ocrText: string): OcrPipelineResult {
  const raw: RawParsedMetric[] = parseOcrText(ocrText, { lookaheadLines: 10 });
  const metrics: CanonicalMetric[] = canonicalizeMetrics(raw);
  const oppyById = pickOppyMap(metrics);
  // Dev log for later screens wiring (non-UI)
  // eslint-disable-next-line no-console
  console.log('MTD Oppy Map:', oppyById);
  return { metrics, oppyById };
}
