import Tesseract from 'tesseract.js';
import type { OcrProvider, OcrProviderRecognizeOptions } from './ocrClient';

export const tesseractProvider: OcrProvider = {
  name: 'tesseract',
  async recognize(image: Blob, options?: OcrProviderRecognizeOptions): Promise<string> {
    const { onProgress, signal } = options || {};
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal) {
      if (signal.aborted) abort();
      else signal.addEventListener('abort', abort, { once: true });
    }
    try {
      const result = await Tesseract.recognize(image, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text' && typeof m.progress === 'number') {
            try { onProgress?.(m.progress); } catch {}
          }
        },
      });
      return result.data?.text ?? '';
    } finally {
      signal?.removeEventListener('abort', abort as EventListener);
    }
  },
};


