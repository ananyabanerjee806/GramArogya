import sharp from 'sharp';
import { ImageQualityReport } from '@/types';

/**
 * Diagnostic analysis of prescription image quality
 */
export async function analyzeImageQuality(imageBuffer: Buffer): Promise<ImageQualityReport> {
  const metadata = await sharp(imageBuffer).metadata();
  const width = metadata.width || 800;
  const height = metadata.height || 600;

  // Calculate statistics (brightness, contrast, sharpness)
  const stats = await sharp(imageBuffer).stats();
  
  // Calculate average brightness across channels (0-255)
  const avgBrightness = stats.channels.reduce((sum, ch) => sum + ch.mean, 0) / stats.channels.length;
  
  // Calculate standard deviation across channels as proxy for contrast & sharpness
  const avgStdDev = stats.channels.reduce((sum, ch) => sum + ch.stdev, 0) / stats.channels.length;

  const warnings: string[] = [];
  let score = 100;

  // Brightness check
  let brightnessLevel: 'Low' | 'Normal' | 'High' = 'Normal';
  let isLowLight = false;
  if (avgBrightness < 65) {
    brightnessLevel = 'Low';
    isLowLight = true;
    warnings.push('Low lighting detected. Please ensure the prescription is well lit.');
    score -= 25;
  } else if (avgBrightness > 225) {
    brightnessLevel = 'High';
    warnings.push('High glare or overexposure detected.');
    score -= 15;
  }

  // Blurriness / Sharpness check based on variance/std dev
  let isBlurry = false;
  if (avgStdDev < 28) {
    isBlurry = true;
    warnings.push('Image appears blurry or low contrast. Details may be hard to read.');
    score -= 30;
  }

  // Dimension / Resolution check
  let isTiltedOrCropped = false;
  if (width < 500 || height < 500) {
    isTiltedOrCropped = true;
    warnings.push('Image resolution is very low (<500px). Higher resolution is recommended.');
    score -= 20;
  }

  const finalScore = Math.max(10, Math.min(100, Math.round(score)));
  const isAcceptable = finalScore >= 45;

  return {
    isAcceptable,
    score: finalScore,
    warnings,
    brightness: brightnessLevel,
    isBlurry,
    isLowLight,
    isTiltedOrCropped,
    dimensions: { width, height },
  };
}

/**
 * Preprocesses prescription image to maximize Tesseract OCR character accuracy:
 * - Auto-rotate based on EXIF
 * - Grayscale conversion
 * - Contrast stretching (normalize)
 * - Sharpening filter
 * - Noise reduction & thresholding
 */
export async function preprocessPrescriptionImage(imageBuffer: Buffer): Promise<{
  preprocessedBuffer: Buffer;
  qualityReport: ImageQualityReport;
}> {
  const qualityReport = await analyzeImageQuality(imageBuffer);

  // Apply Sharp multi-stage image enhancement pipeline
  const preprocessedBuffer = await sharp(imageBuffer)
    .rotate() // Auto-orient using EXIF
    .resize({ width: 2200, withoutEnlargement: false, fit: 'inside' }) // Upscale/standardize resolution for OCR
    .grayscale() // Grayscale for clear text boundaries
    .normalize() // Stretch luminance to cover full 0-255 dynamic range
    .sharpen({ sigma: 1.5, m1: 0.8, m2: 2.0 }) // Sharpen handwriting edges
    .linear(1.15, -15) // Boost contrast
    .toFormat('png')
    .toBuffer();

  return {
    preprocessedBuffer,
    qualityReport,
  };
}
