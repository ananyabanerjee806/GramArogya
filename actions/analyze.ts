'use server';

import { preprocessPrescriptionImage } from '@/lib/ocr/preprocess';
import { extractTextWithTesseract } from '@/lib/ocr/tesseract';
import { processPrescriptionWithGemini } from '@/lib/ocr/gemini';
import { AnalysisPipelineResponse } from '@/types';

export async function analyzePrescriptionAction(
  formData: FormData
): Promise<AnalysisPipelineResponse> {
  try {
    const file = formData.get('file') as File | null;
    const base64Data = formData.get('base64') as string | null;

    let imageBuffer: Buffer;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      imageBuffer = Buffer.from(bytes);
    } else if (base64Data) {
      const cleaned = base64Data.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(cleaned, 'base64');
    } else {
      return {
        success: false,
        ocrResult: {
          rawText: '',
          confidenceScore: 0,
          confidenceLevel: 'Needs Review',
          words: [],
          uncertainWords: [],
        },
        aiAnalysis: {
          corrected_text: '',
          summary: '',
          medicines: [],
          important_findings: [],
          tags: [],
        },
        error: 'No image file or image data provided.',
      };
    }

    // Step 1: Image Quality Diagnostics and Preprocessing (Sharp)
    const { preprocessedBuffer, qualityReport } = await preprocessPrescriptionImage(imageBuffer);

    // Step 2: Tesseract OCR Engine (runs on preprocessed buffer)
    const ocrResult = await extractTextWithTesseract(preprocessedBuffer);

    // If raw OCR is completely empty, provide informative notice
    const textToAnalyze = ocrResult.rawText && ocrResult.rawText.trim().length > 0
      ? ocrResult.rawText
      : 'Handwritten prescription image received. Extracting clinical details...';

    // Step 3: Google Gemini AI Analysis & Medical Structuring
    const aiAnalysis = await processPrescriptionWithGemini(textToAnalyze, imageBuffer);

    return {
      success: true,
      qualityReport,
      ocrResult,
      aiAnalysis,
    };
  } catch (error: any) {
    console.error('Error during prescription analysis pipeline:', error);
    return {
      success: false,
      ocrResult: {
        rawText: '',
        confidenceScore: 0,
        confidenceLevel: 'Needs Review',
        words: [],
        uncertainWords: [],
      },
      aiAnalysis: {
        corrected_text: '',
        summary: '',
        medicines: [],
        important_findings: [],
        tags: [],
      },
      error: error.message || 'An error occurred while processing the prescription.',
    };
  }
}
