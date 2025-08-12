export interface OcrPreprocessOptions {
  /** Maximum length for the longest side in pixels. Default: 2000 */
  maxSize?: number;
  /** Odd window size for adaptive threshold (local mean). Default: 15 */
  thresholdWindow?: number;
  /** Constant subtracted from local mean. Higher -> more black text. Default: 7 */
  thresholdOffset?: number;
  /** Output mime type. Default: 'image/png' */
  outputType?: 'image/png' | 'image/jpeg' | 'image/webp';
  /** Quality for lossy formats [0..1]. Ignored for PNG. Default: 0.92 */
  outputQuality?: number;
}

/**
 * Load an input into an ImageBitmap with EXIF-based auto-orientation when possible.
 */
async function loadAsImageBitmap(
  input: Blob | HTMLImageElement | HTMLCanvasElement | ImageBitmap | string
): Promise<ImageBitmap> {
  // Fast path: already an ImageBitmap
  if (typeof ImageBitmap !== 'undefined' && input instanceof ImageBitmap) {
    return input;
  }

  // Convert element/canvas/string to Blob when viable to leverage imageOrientation
  const toBlob = async (): Promise<Blob> => {
    if (typeof input === 'string') {
      // Assume URL or data URL. Fetch to get a Blob.
      const res = await fetch(input);
      return await res.blob();
    }
    if (input instanceof Blob) return input;

    if (input instanceof HTMLCanvasElement) {
      return await new Promise<Blob>((resolve, reject) => {
        input.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))));
      });
    }
    if (input instanceof HTMLImageElement) {
      // Draw onto a temp canvas to produce a Blob
      const { naturalWidth: w, naturalHeight: h } = input;
      const tmp = document.createElement('canvas');
      tmp.width = Math.max(1, w);
      tmp.height = Math.max(1, h);
      const ctx = tmp.getContext('2d');
      if (!ctx) throw new Error('2D context not available');
      ctx.drawImage(input, 0, 0);
      return await new Promise<Blob>((resolve, reject) => {
        tmp.toBlob((b) => (b ? resolve(b) : reject(new Error('Image toBlob failed'))));
      });
    }

    // Fallback: try structured clone to Blob if none matched
    throw new Error('Unsupported input type');
  };

  const blob = await toBlob();

  // Use ImageBitmap to auto-apply EXIF orientation where supported
  // Note: createImageBitmap options are widely supported in modern browsers (Chromium/Firefox/Safari)
  return await createImageBitmap(blob, { imageOrientation: 'from-image' });
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(width));
  canvas.height = Math.max(1, Math.floor(height));
  return canvas;
}

function drawImageToCanvas(img: CanvasImageSource, width: number, height: number): HTMLCanvasElement {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D context not available');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

function convertToGrayscale(data: Uint8ClampedArray): Uint8ClampedArray {
  // Returns single-channel grayscale array (length = numPixels)
  const gray = new Uint8ClampedArray(data.length / 4);
  for (let i = 0, gi = 0; i < data.length; i += 4, gi += 1) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Luma (BT.601)
    gray[gi] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
  return gray;
}

function adaptiveThreshold(
  gray: Uint8ClampedArray,
  width: number,
  height: number,
  windowSize: number,
  offset: number
): Uint8ClampedArray {
  const half = Math.max(1, Math.floor(windowSize / 2));
  const W1 = width + 1;
  const H1 = height + 1;
  const integral = new Float64Array(W1 * H1);

  // Build integral image (1-indexed to simplify bounds)
  for (let y = 1; y <= height; y++) {
    let rowsum = 0;
    for (let x = 1; x <= width; x++) {
      const v = gray[(y - 1) * width + (x - 1)];
      rowsum += v;
      const idx = y * W1 + x;
      integral[idx] = integral[(y - 1) * W1 + x] + rowsum;
    }
  }

  const out = new Uint8ClampedArray(width * height);

  for (let y = 0; y < height; y++) {
    const y0 = Math.max(0, y - half);
    const y1 = Math.min(height - 1, y + half);
    const row0 = y0;
    const row1 = y1;
    for (let x = 0; x < width; x++) {
      const x0 = Math.max(0, x - half);
      const x1 = Math.min(width - 1, x + half);

      // Integral indices are +1 due to 1-indexed grid
      const A = integral[row0 * W1 + x0];
      const B = integral[row0 * W1 + (x1 + 1)];
      const C = integral[(row1 + 1) * W1 + x0];
      const D = integral[(row1 + 1) * W1 + (x1 + 1)];
      const area = (x1 - x0 + 1) * (y1 - y0 + 1);
      const localMean = (D - B - C + A) / area;

      const v = gray[y * width + x];
      // If pixel is significantly darker than the local mean, set to black
      out[y * width + x] = v <= localMean - offset ? 0 : 255;
    }
  }

  return out;
}

function writeBinaryToRgba(binary: Uint8ClampedArray, width: number, height: number): ImageData {
  const rgba = new Uint8ClampedArray(width * height * 4);
  for (let i = 0, j = 0; i < binary.length; i++, j += 4) {
    const v = binary[i];
    rgba[j] = v;
    rgba[j + 1] = v;
    rgba[j + 2] = v;
    rgba[j + 3] = 255;
  }
  return new ImageData(rgba, width, height);
}

/**
 * Preprocess an image for OCR: auto-orient → resize → grayscale → adaptive threshold.
 * Returns a Blob suitable for OCR ingestion.
 */
export async function preprocessForOcr(
  input: Blob | HTMLImageElement | HTMLCanvasElement | ImageBitmap | string,
  options: OcrPreprocessOptions = {}
): Promise<Blob> {
  const {
    maxSize = 2000,
    thresholdWindow = 15,
    thresholdOffset = 7,
    outputType = 'image/png',
    outputQuality = 0.92,
  } = options;

  if (thresholdWindow % 2 === 0) {
    throw new Error('thresholdWindow must be an odd integer');
  }

  const bitmap = await loadAsImageBitmap(input);

  // Compute target size keeping aspect ratio
  const srcW = bitmap.width;
  const srcH = bitmap.height;
  const scale = Math.min(1, maxSize / Math.max(srcW, srcH));
  const dstW = Math.max(1, Math.round(srcW * scale));
  const dstH = Math.max(1, Math.round(srcH * scale));

  // Draw resized, auto-oriented image
  const baseCanvas = drawImageToCanvas(bitmap, dstW, dstH);
  const ctx = baseCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D context not available');
  const imgData = ctx.getImageData(0, 0, dstW, dstH);

  // Grayscale
  const gray = convertToGrayscale(imgData.data);

  // Adaptive threshold
  const binary = adaptiveThreshold(gray, dstW, dstH, thresholdWindow, thresholdOffset);

  // Write out result
  const outImageData = writeBinaryToRgba(binary, dstW, dstH);
  ctx.putImageData(outImageData, 0, 0);

  // Export as Blob
  const blob: Blob = await new Promise((resolve, reject) => {
    baseCanvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), outputType, outputQuality);
  });

  return blob;
}
