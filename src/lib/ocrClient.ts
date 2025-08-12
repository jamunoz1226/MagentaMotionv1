import { preprocessForOcr, type OcrPreprocessOptions } from './ocrPreprocess';

export type OcrProgressLabel = 'Enhancing Image' | 'Extracting Text';

export interface OcrProviderRecognizeOptions {
  signal?: AbortSignal;
  onProgress?: (progress: number | undefined) => void;
}

export interface OcrProvider {
  /** Provider name (e.g., 'tesseract', 'google-vision', etc.) */
  name: string;
  /**
   * Perform OCR on the provided image Blob.
   * Implementations should respect AbortSignal to allow cancellation.
   */
  recognize: (image: Blob, options?: OcrProviderRecognizeOptions) => Promise<string>;
}

export interface OcrClientOptions {
  /** Hard timeout in milliseconds for the whole OCR flow. Default: 30000 */
  timeoutMs?: number;
  /** Options for preprocessing (resize/threshold). */
  preprocess?: OcrPreprocessOptions;
  /** Receive coarse-grained progress labels. */
  onProgress?: (label: OcrProgressLabel) => void;
  /** Optional external AbortSignal to cancel the operation. */
  signal?: AbortSignal;
  /** Optional passthrough progress for provider-specific progress */
  onProviderProgress?: (progress: number | undefined) => void;
}

function withTimeout<T>(promise: Promise<T>, ms: number, onTimeout?: () => void): Promise<T> {
  if (!(ms > 0)) return promise;
  let timeoutId: number | ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      try { onTimeout?.(); } catch { /* noop */ }
      reject(new Error('OCR timed out'));
    }, ms);
  });
  return Promise.race([
    promise.finally(() => {
      if (timeoutId) clearTimeout(timeoutId as number);
    }),
    timeoutPromise,
  ]) as Promise<T>;
}

/**
 * Run OCR with progress and a hard timeout using a pluggable provider.
 * Progress emits: "Enhancing Image" → "Extracting Text".
 */
export async function runOcr(
  input: Blob | HTMLImageElement | HTMLCanvasElement | ImageBitmap | string,
  provider: OcrProvider,
  options: OcrClientOptions = {}
): Promise<string> {
  const {
    timeoutMs = 30000,
    preprocess: preprocessOptions,
    onProgress,
    signal: externalSignal,
    onProviderProgress,
  } = options;

  // Combine external AbortSignal with an internal controller to cancel provider work on timeout
  const controller = new AbortController();
  const abortOnExternal = () => controller.abort(new DOMException('Aborted', 'AbortError'));
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort(externalSignal.reason);
    } else {
      externalSignal.addEventListener('abort', abortOnExternal, { once: true });
    }
  }

  const startedAt = Date.now();

  const core = (async () => {
    onProgress?.('Enhancing Image');
    // Preprocess with its own timeout equal to total timeout to ensure we never hang here
    const preprocessed = await withTimeout(
      preprocessForOcr(input, preprocessOptions),
      timeoutMs,
    );

    // Compute remaining time for provider stage
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, timeoutMs - elapsed);
    if (remaining === 0) {
      throw new Error('OCR timed out');
    }

    onProgress?.('Extracting Text');
    const text = await withTimeout(
      provider.recognize(preprocessed, { signal: controller.signal, onProgress: onProviderProgress }),
      remaining,
      () => controller.abort(new DOMException('Timeout', 'AbortError')),
    );

    return text;
  })();

  try {
    const result = await core;
    return result;
  } finally {
    // Cleanup listener
    if (externalSignal) {
      externalSignal.removeEventListener('abort', abortOnExternal as EventListener);
    }
  }
}
