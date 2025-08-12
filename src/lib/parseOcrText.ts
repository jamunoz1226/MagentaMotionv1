import { EXCLUDES } from '../constants/labelMap';

export interface RawParsedMetric {
  rawLabel: string;
  actual?: number;
  target?: number;
  percent?: number;
}

export interface ParseOcrOptions {
  /** Number of lines to scan after a label. Default: 5 */
  lookaheadLines?: number;
  /** If true, trims trailing punctuation from label lines. Default: true */
  trimLabel?: boolean;
}

const ACTUAL_RE = /Actual\s*:\s*([\d,]+)/i;
const TARGET_RE = /Target\s*:\s*([\d,]+)/i;
const PCT_RE = /(\d+(?:\.\d+)?)\s*%/;

function normalizeInt(text: string | undefined): number | undefined {
  if (!text) return undefined;
  const cleaned = text.replace(/,/g, '');
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeFloat(text: string | undefined): number | undefined {
  if (!text) return undefined;
  const cleaned = text.replace(/,/g, '');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

function isExcluded(label: string): boolean {
  return EXCLUDES.some((re) => re.test(label));
}

function looksLikeLabel(line: string): boolean {
  if (!line) return false;
  // Ignore lines that are purely numbers or just percent numbers
  if (/^\s*[\d,]+\s*$/.test(line)) return false;
  if (/^\s*\d+(?:\.\d+)?\s*%\s*$/.test(line)) return false;
  // Ignore lines that start with Actual: or Target:
  if (/^\s*Actual\s*:/i.test(line)) return false;
  if (/^\s*Target\s*:/i.test(line)) return false;
  // Require at least one letter character
  if (!/[A-Za-z]/.test(line)) return false;
  return true;
}

/**
 * Parse OCR text into raw metric blocks by scanning label lines and looking ahead
 * for Actual, Target, and Percent values.
 */
export function parseOcrText(input: string, options: ParseOcrOptions = {}): RawParsedMetric[] {
  const { lookaheadLines = 5, trimLabel = true } = options;
  if (!input) return [];

  const lines = input
    .split(/\r?\n/) // keep order
    .map((l) => l.replace(/[\t\f\v]+/g, ' ').trim());

  const results: RawParsedMetric[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!looksLikeLabel(line)) continue;

    // Skip excluded labels
    if (isExcluded(line)) continue;

    let rawLabel = line;
    if (trimLabel) {
      rawLabel = rawLabel.replace(/[\s:;,.\-–—]+$/, '').trim();
    }

    let actual: number | undefined;
    let target: number | undefined;
    let percent: number | undefined;

    const end = Math.min(lines.length, i + 1 + Math.max(0, lookaheadLines));
    for (let j = i + 1; j < end; j++) {
      const next = lines[j];
      if (!next) continue;

      if (actual === undefined) {
        const m = next.match(ACTUAL_RE);
        if (m) actual = normalizeInt(m[1]);
      }
      if (target === undefined) {
        const m = next.match(TARGET_RE);
        if (m) target = normalizeInt(m[1]);
      }
      if (percent === undefined) {
        const m = next.match(PCT_RE);
        if (m) percent = normalizeFloat(m[1]);
      }

      // Early exit if all found
      if (actual !== undefined && target !== undefined && percent !== undefined) break;
    }

    // Only include blocks that have at least one numeric finding
    if (actual !== undefined || target !== undefined || percent !== undefined) {
      results.push({ rawLabel, actual, target, percent });
    }
  }

  return results;
}
