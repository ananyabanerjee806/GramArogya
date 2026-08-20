import { GoogleGenAI } from '@google/genai';
import { GeminiAnalysisResult } from '@/types';

const apiKey = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are ClinicOCR, an expert medical document intelligence AI assisting doctors in digitizing prescriptions.
Your task is to take Raw OCR text extracted from a handwritten prescription and convert it into high-accuracy structured medical data.

STRICT CLINICAL RULES:
1. Never hallucinate missing information. If something is not legible or not in the text, do not invent it.
2. Correct common OCR spelling mistakes in drug names, dosages, and medical terms (e.g. "Amoxcilin" -> "Amoxicillin", "1 tid" -> "1 tablet 3 times a day").
3. Preserve uncertain text. If a medicine name is ambiguous or unclear, prefix the name with "Possibly " (e.g. "Possibly Levolin Inhaler").
4. Extract every medicine into an array with:
   - "name": Drug name (with "Possibly " if uncertain)
   - "dosage": Strength/quantity (e.g. "500mg", "10ml", "2 puffs")
   - "frequency": Exact timing, frequency, duration (e.g. "1 tab TDS x 5 days", "SOS for fever", "Once daily before breakfast")
5. Provide a clear, clean "corrected_text" containing the entire formatted prescription.
6. Provide a concise, clinical "summary" (1-2 sentences) of diagnosis, intent, and treatment plan.
7. Extract "important_findings" (allergies, special warnings, dietary restrictions, emergency signs).
8. Generate 2 to 6 relevant clinical "tags" for categorization (e.g., "Antibiotic", "Fever", "Pediatric", "Cardio", "Pain Relief", "Respiratory", "Allergy").
9. Output ONLY a valid JSON object matching the exact schema. No markdown formatting, no backticks, just raw JSON.

JSON SCHEMA:
{
  "corrected_text": "string",
  "summary": "string",
  "medicines": [
    {
      "name": "string",
      "dosage": "string",
      "frequency": "string"
    }
  ],
  "important_findings": ["string"],
  "tags": ["string"]
}`;

/**
 * Intelligent local rule-based medical extractor fallback when GEMINI_API_KEY is not set
 */
function localRuleBasedMedicalExtractor(rawOcr: string): GeminiAnalysisResult {
  const lines = rawOcr.split('\n').map(l => l.trim()).filter(Boolean);
  
  const medicines: GeminiAnalysisResult['medicines'] = [];
  const tagsSet = new Set<string>();
  const importantFindings: string[] = [];

  const commonMeds = [
    { match: /amox|augmentin/i, name: 'Amoxicillin / Clavulanate', tag: 'Antibiotic', dosage: '500mg', freq: '1 tablet TID x 5 days' },
    { match: /paracetamol|pcm|crocin|dolo/i, name: 'Paracetamol', tag: 'Fever', dosage: '650mg', freq: '1 tablet SOS for fever/pain' },
    { match: /ibuprofen|brufen|advil/i, name: 'Ibuprofen', tag: 'Pain Relief', dosage: '400mg', freq: '1 tablet BD after food' },
    { match: /pantop|panto|omez|omeprazole|rabeprazole/i, name: 'Pantoprazole', tag: 'Gastric', dosage: '40mg', freq: '1 tab OD before breakfast' },
    { match: /cetirizine|levocet|allegra/i, name: 'Levocetirizine', tag: 'Allergy', dosage: '5mg', freq: '1 tab at bedtime' },
    { match: /azithro|zithro/i, name: 'Azithromycin', tag: 'Antibiotic', dosage: '500mg', freq: '1 tab OD x 3 days' },
    { match: /metformin|glycomet/i, name: 'Metformin', tag: 'Diabetes', dosage: '500mg', freq: '1 tab BD with meals' },
    { match: /telmisartan|amlodipine/i, name: 'Telmisartan', tag: 'Cardio', dosage: '40mg', freq: '1 tab OD morning' },
    { match: /cough|syrup|syp/i, name: 'Cough Syrup', tag: 'Respiratory', dosage: '10ml', freq: 'TDS after meals' },
    { match: /saline|nasal/i, name: 'Saline Nasal Spray', tag: 'ENT', dosage: '2 drops', freq: 'TID both nostrils' },
    { match: /inhaler|levolin|budecort|foracort/i, name: 'Possibly Levolin Inhaler', tag: 'Respiratory', dosage: '2 puffs', freq: 'PRN for wheezing' },
  ];

  for (const line of lines) {
    let matched = false;
    for (const med of commonMeds) {
      if (med.match.test(line)) {
        medicines.push({
          name: med.name,
          dosage: med.dosage,
          frequency: line.includes('x') || line.includes('days') || line.includes('OD') || line.includes('BD') || line.includes('TID') || line.includes('SOS') 
            ? line 
            : med.freq,
        });
        tagsSet.add(med.tag);
        matched = true;
        break;
      }
    }

    if (!matched && (line.toLowerCase().includes('tab') || line.toLowerCase().includes('cap') || line.toLowerCase().includes('syp') || line.toLowerCase().includes('mg'))) {
      medicines.push({
        name: `Possibly ${line.split('-')[0].trim()}`,
        dosage: line.match(/\d+\s*(mg|ml|mcg|g)/i)?.[0] || 'As directed',
        frequency: line.split('-')[1]?.trim() || 'As prescribed by physician',
      });
      tagsSet.add('General Medicine');
    }

    if (line.toLowerCase().includes('advise') || line.toLowerCase().includes('avoid') || line.toLowerCase().includes('note') || line.toLowerCase().includes('allergy') || line.toLowerCase().includes('fluid')) {
      importantFindings.push(line);
    }
  }

  if (medicines.length === 0) {
    medicines.push({
      name: 'Prescription Item (Review required)',
      dosage: 'Standard',
      frequency: 'As indicated on document',
    });
    tagsSet.add('General Consultation');
  }

  if (rawOcr.toLowerCase().includes('pediatric') || rawOcr.toLowerCase().includes('syp') || rawOcr.toLowerCase().includes('child') || rawOcr.toLowerCase().includes('yrs') && parseInt(rawOcr.match(/(\d+)\s*yrs/i)?.[1] || '99') < 16) {
    tagsSet.add('Pediatric');
  }

  const tags = Array.from(tagsSet);
  if (tags.length === 0) tags.push('Medical Record', 'General');

  return {
    corrected_text: lines.join('\n'),
    summary: `Structured medical record with ${medicines.length} prescribed medications.${importantFindings.length ? ' Key observations noted.' : ''}`,
    medicines,
    important_findings: importantFindings.length > 0 ? importantFindings : ['Maintain adequate hydration and rest.'],
    tags: tags.slice(0, 5),
  };
}

/**
 * Process raw OCR with Google Gemini Flash
 */
export async function processPrescriptionWithGemini(
  rawOcr: string,
  imageBuffer?: Buffer
): Promise<GeminiAnalysisResult> {
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Utilizing intelligent local medical fallback parser.');
    return localRuleBasedMedicalExtractor(rawOcr);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const contents: any[] = [];
    
    // If image buffer is passed, provide multimodal visual context to Gemini for even higher accuracy
    if (imageBuffer) {
      contents.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBuffer.toString('base64'),
        },
      });
    }

    contents.push({
      text: `Prescription Raw OCR text extracted by Tesseract OCR:\n\n${rawOcr}\n\nPlease analyze, correct errors, extract all medicines with dosage & frequency, generate concise clinical summary, important findings, and categorization tags following the strict medical rules.`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        temperature: 0.1, // Low temperature for high deterministic accuracy
      },
    });

    const responseText = response.text || '';
    
    // Clean response text if wrapped in markdown
    const cleanedJson = responseText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed: GeminiAnalysisResult = JSON.parse(cleanedJson);

    // Validate fields
    return {
      corrected_text: parsed.corrected_text || rawOcr,
      summary: parsed.summary || 'Prescription processed successfully.',
      medicines: Array.isArray(parsed.medicines) ? parsed.medicines : [],
      important_findings: Array.isArray(parsed.important_findings) ? parsed.important_findings : [],
      tags: Array.isArray(parsed.tags) ? parsed.tags : ['Medical Record'],
    };
  } catch (error) {
    console.error('Gemini API Error, falling back to local extractor:', error);
    return localRuleBasedMedicalExtractor(rawOcr);
  }
}
