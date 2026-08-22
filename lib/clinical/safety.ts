/**
 * Clinical Safety Engine: Drug-to-Drug Interaction Analyzer & Generic Medicine Database
 */

export interface DrugInteractionWarning {
  severity: 'high' | 'moderate' | 'low';
  drugs: [string, string];
  title: string;
  description: string;
  recommendation: string;
}

export interface GenericDrugInfo {
  brandName: string;
  genericName: string;
  category: string;
  averageSavingsPercent: number;
}

// Common Brand to Generic dictionary with typical savings
export const GENERIC_DRUG_DATABASE: Record<string, GenericDrugInfo> = {
  augmentin: {
    brandName: 'Augmentin',
    genericName: 'Amoxicillin + Potassium Clavulanate',
    category: 'Broad-Spectrum Antibiotic',
    averageSavingsPercent: 55,
  },
  dolo: {
    brandName: 'Dolo 650',
    genericName: 'Paracetamol / Acetaminophen (650mg)',
    category: 'Analgesic & Antipyretic',
    averageSavingsPercent: 40,
  },
  calpol: {
    brandName: 'Calpol',
    genericName: 'Paracetamol / Acetaminophen',
    category: 'Analgesic & Antipyretic',
    averageSavingsPercent: 45,
  },
  crocin: {
    brandName: 'Crocin',
    genericName: 'Paracetamol',
    category: 'Analgesic & Antipyretic',
    averageSavingsPercent: 35,
  },
  pantocid: {
    brandName: 'Pantocid / Pan 40',
    genericName: 'Pantoprazole Sodium (40mg)',
    category: 'Proton Pump Inhibitor (PPI)',
    averageSavingsPercent: 60,
  },
  pan: {
    brandName: 'Pan 40',
    genericName: 'Pantoprazole (40mg)',
    category: 'Proton Pump Inhibitor (PPI)',
    averageSavingsPercent: 50,
  },
  allegra: {
    brandName: 'Allegra',
    genericName: 'Fexofenadine Hydrochloride',
    category: 'Non-sedating Antihistamine',
    averageSavingsPercent: 65,
  },
  zithromax: {
    brandName: 'Zithromax / Azithral',
    genericName: 'Azithromycin',
    category: 'Macrolide Antibiotic',
    averageSavingsPercent: 50,
  },
  azithral: {
    brandName: 'Azithral',
    genericName: 'Azithromycin',
    category: 'Macrolide Antibiotic',
    averageSavingsPercent: 45,
  },
  lipitor: {
    brandName: 'Lipitor / Atorva',
    genericName: 'Atorvastatin Calcium',
    category: 'Statin / Cholesterol',
    averageSavingsPercent: 70,
  },
  glucophage: {
    brandName: 'Glucophage / Glycomet',
    genericName: 'Metformin Hydrochloride',
    category: 'Biguanide Antidiabetic',
    averageSavingsPercent: 55,
  },
  glycomet: {
    brandName: 'Glycomet',
    genericName: 'Metformin Hydrochloride',
    category: 'Biguanide Antidiabetic',
    averageSavingsPercent: 40,
  },
  combiflam: {
    brandName: 'Combiflam',
    genericName: 'Ibuprofen (400mg) + Paracetamol (325mg)',
    category: 'Dual NSAID Analgesic',
    averageSavingsPercent: 35,
  },
  telma: {
    brandName: 'Telma 40',
    genericName: 'Telmisartan (40mg)',
    category: 'Angiotensin II Receptor Blocker (ARB)',
    averageSavingsPercent: 60,
  },
};

// Known critical drug-to-drug interactions rule base
const INTERACTION_RULES: {
  drug1: RegExp;
  drug2: RegExp;
  severity: 'high' | 'moderate' | 'low';
  title: string;
  description: string;
  recommendation: string;
}[] = [
  {
    drug1: /aspirin|ecosprin|clopidogrel|warfarin|heparin|rivaroxaban/i,
    drug2: /ibuprofen|brufen|combiflam|naproxen|diclofenac|aceclofenac/i,
    severity: 'high',
    title: 'Severe Bleeding & GI Toxicity Risk',
    description: 'Concurrent use of antiplatelets/anticoagulants with NSAIDs significantly elevates gastrointestinal bleeding risk and blunts cardioprotective antiplatelet effects.',
    recommendation: 'Avoid concurrent NSAID; use Paracetamol for analgesia or add a gastroprotective PPI.',
  },
  {
    drug1: /methotrexate/i,
    drug2: /amoxicillin|ampicillin|penicillin/i,
    severity: 'high',
    title: 'Reduced Methotrexate Clearance (Toxicity)',
    description: 'Penicillins can decrease the renal clearance of methotrexate, leading to elevated toxic serum levels.',
    recommendation: 'Monitor complete blood counts and renal function closely; consider alternative antibiotic.',
  },
  {
    drug1: /ciprofloxacin|levofloxacin|norfloxacin/i,
    drug2: /antacid|pantoprazole|omeprazole|sucralfate|iron|calcium/i,
    severity: 'moderate',
    title: 'Reduced Fluoroquinolone Absorption',
    description: 'Antacids and polyvalent cations bind to fluoroquinolones, drastically reducing antibiotic bioavailability.',
    recommendation: 'Administer fluoroquinolone at least 2 hours before or 4 hours after antacids.',
  },
  {
    drug1: /paracetamol|pcm|dolo|crocin|calpol/i,
    drug2: /combiflam|flexon|paracetamol/i,
    severity: 'moderate',
    title: 'Paracetamol / Acetaminophen Duplication Risk',
    description: 'Multiple medications contain Paracetamol. Total cumulative dose must not exceed 4,000mg/24h to avoid hepatotoxicity.',
    recommendation: 'Verify cumulative 24-hour paracetamol intake across all prescribed items.',
  },
  {
    drug1: /telmisartan|losartan|ramipril|enalapril/i,
    drug2: /spironolactone|potassium/i,
    severity: 'moderate',
    title: 'Hyperkalemia Risk',
    description: 'Combining RAAS inhibitors with potassium-sparing agents can cause dangerous elevations in serum potassium.',
    recommendation: 'Monitor serum electrolytes and renal parameters periodically.',
  },
  {
    drug1: /metformin|glycomet/i,
    drug2: /contrast|alcohol/i,
    severity: 'moderate',
    title: 'Lactic Acidosis Precaution',
    description: 'Excessive alcohol or iodinated contrast media during metformin therapy increases lactic acidosis risk.',
    recommendation: 'Advise patient to avoid alcohol; withhold prior to iodinated contrast radiological procedures.',
  },
  {
    drug1: /cetirizine|levocetirizine|chlorpheniramine/i,
    drug2: /diazepam|alprazolam|sedative|alcohol/i,
    severity: 'moderate',
    title: 'Enhanced CNS Depression & Sedation',
    description: 'Additive sedating effects can severely impair psychomotor reflexes and alertness.',
    recommendation: 'Advise patient against driving or operating machinery.',
  },
];

/**
 * Analyze a list of prescribed medicines for potential drug-to-drug interactions
 */
export function checkDrugInteractions(
  medicines: { name: string; dosage?: string }[]
): DrugInteractionWarning[] {
  const warnings: DrugInteractionWarning[] = [];
  const medNames = medicines.map((m) => m.name.toLowerCase().trim()).filter(Boolean);

  for (let i = 0; i < medNames.length; i++) {
    for (let j = i + 1; j < medNames.length; j++) {
      const nameA = medNames[i];
      const nameB = medNames[j];

      for (const rule of INTERACTION_RULES) {
        const matchesA1 = rule.drug1.test(nameA);
        const matchesB2 = rule.drug2.test(nameB);
        const matchesA2 = rule.drug2.test(nameA);
        const matchesB1 = rule.drug1.test(nameB);

        if ((matchesA1 && matchesB2) || (matchesA2 && matchesB1)) {
          // Avoid duplicate warnings for same pair
          const alreadyAdded = warnings.some(
            (w) =>
              (w.drugs[0] === nameA && w.drugs[1] === nameB) ||
              (w.drugs[0] === nameB && w.drugs[1] === nameA)
          );

          if (!alreadyAdded) {
            warnings.push({
              severity: rule.severity,
              drugs: [medicines[i].name, medicines[j].name],
              title: rule.title,
              description: rule.description,
              recommendation: rule.recommendation,
            });
          }
        }
      }
    }
  }

  return warnings;
}

/**
 * Find generic substitution recommendations for a given medicine name
 */
export function findGenericAlternative(medicineName: string): GenericDrugInfo | null {
  const cleanName = medicineName.toLowerCase().replace(/^possibly\s+/, '').trim();

  for (const [key, value] of Object.entries(GENERIC_DRUG_DATABASE)) {
    if (cleanName.includes(key)) {
      return value;
    }
  }

  return null;
}
