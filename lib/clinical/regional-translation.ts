/**
 * Multi-Language Regional Translation Engine for Medical Prescriptions
 * Supports Hindi, Marathi, Tamil, Bengali, and Telugu
 */

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'ta' | 'bn' | 'te';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
];

export interface TranslatedFrequency {
  language: SupportedLanguage;
  timingSchedule: string;
  dosageInstructions: string;
  mealAdvice: string;
}

/**
 * Translates standard medical frequencies (TID, BD, OD, SOS, AC, PC, HS) into regional Indian languages
 */
export function translateMedicalFrequency(
  frequencyText: string,
  targetLang: SupportedLanguage = 'hi'
): TranslatedFrequency {
  const freq = (frequencyText || '').toLowerCase();

  const translations: Record<SupportedLanguage, {
    tid: string;
    bd: string;
    odAc: string;
    odPc: string;
    odHs: string;
    sos: string;
    default: string;
    mealBefore: string;
    mealAfter: string;
  }> = {
    en: {
      tid: '3 times daily (Morning, Afternoon, Night)',
      bd: '2 times daily (Morning and Night)',
      odAc: 'Once daily (Morning on empty stomach)',
      odPc: 'Once daily (Morning after breakfast)',
      odHs: 'Once daily (At bedtime)',
      sos: 'As needed (for fever or pain)',
      default: 'Take as directed by doctor',
      mealBefore: 'Before food',
      mealAfter: 'After food',
    },
    hi: {
      tid: 'दिन में 3 बार (सुबह - दोपहर - रात)',
      bd: 'दिन में 2 बार (सुबह और रात)',
      odAc: 'दिन में 1 बार (सुबह खाली पेट)',
      odPc: 'दिन में 1 बार (सुबह नाश्ते के बाद)',
      odHs: 'दिन में 1 बार (रात को सोने से पहले)',
      sos: 'ज़रूरत पड़ने पर (जैसे बुखार या दर्द होने पर)',
      default: 'डॉक्टर की सलाह अनुसार लें',
      mealBefore: 'खाने से पहले',
      mealAfter: 'खाने के बाद',
    },
    mr: {
      tid: 'दिवसातून ३ वेळा (सकाळी - दुपारी - रात्री)',
      bd: 'दिवसातून २ वेळा (सकाळी आणि रात्री)',
      odAc: 'दिवसातून १ वेळ (सकाळी उपाशीपोटी)',
      odPc: 'दिवसातून १ वेळ (सकाळी जेवणानंतर)',
      odHs: 'दिवसातून १ वेळ (रात्री झोपताना)',
      sos: 'गरज असेल तेव्हा (ताप किंवा वेदना असल्यास)',
      default: 'डॉक्टरांच्या सल्ल्यानुसार घ्यावे',
      mealBefore: 'जेवणापूर्वी',
      mealAfter: 'जेवणानंतर',
    },
    ta: {
      tid: 'நாளைக்கு 3 முறை (காலை - மதியம் - இரவு)',
      bd: 'நாளைக்கு 2 முறை (காலை மற்றும் இரவு)',
      odAc: 'நாளைக்கு 1 முறை (காலை வெறும் வயிற்றில்)',
      odPc: 'நாளைக்கு 1 முறை (காலை உணவுக்குப் பின்)',
      odHs: 'நாளைக்கு 1 முறை (இரவு தூங்கும் முன்)',
      sos: 'தேவைப்படும் போது (காய்ச்சல் அல்லது வலிக்கு)',
      default: 'மருத்துவர் அறிவுரைப்படி உட்கொள்ளவும்',
      mealBefore: 'உணவுக்கு முன்',
      mealAfter: 'உணவுக்குப் பின்',
    },
    bn: {
      tid: 'দিনে ৩ বার (সকাল - দুপুর - রাত)',
      bd: 'দিনে ২ বার (সকাল এবং রাত)',
      odAc: 'দিনে ১ বার (সকালে খালি পেটে)',
      odPc: 'দিনে ১ বার (সকালে খাবারের পর)',
      odHs: 'দিনে ১ বার (রাতে ঘুমানোর আগে)',
      sos: 'প্রয়োজনে (যেমন জ্বর বা ব্যথার সময়)',
      default: 'ডাক্তারের পরামর্শ অনুযায়ী সেবন করুন',
      mealBefore: 'খাবারের আগে',
      mealAfter: 'খাবারের পরে',
    },
    te: {
      tid: 'రోజుకు 3 సార్లు (ఉదయం - మధ్యాహ్నం - రాత్రి)',
      bd: 'రోజుకు 2 సార్లు (ఉదయం మరియు రాత్రి)',
      odAc: 'రోజుకు 1 సారి (ఉదయం పరగడుపున)',
      odPc: 'రోజుకు 1 సారి (ఉదయం భోజనం తర్వాత)',
      odHs: 'రోజుకు 1 సారి (రాత్రి పడుకునే ముందు)',
      sos: 'అవసరమైనప్పుడు (జ్వరం లేదా నొప్పి వచ్చినప్పుడు)',
      default: 'వైద్యుల సలహా ప్రకారం తీసుకోండి',
      mealBefore: 'భోజనానికి ముందు',
      mealAfter: 'భోజనం తర్వాత',
    },
  };

  const dict = translations[targetLang] || translations.hi;
  let timingSchedule = dict.default;
  let mealAdvice = dict.mealAfter;

  if (freq.includes('tid') || freq.includes('tds') || freq.includes('3 times') || freq.includes('3x')) {
    timingSchedule = dict.tid;
  } else if (freq.includes('bd') || freq.includes('bid') || freq.includes('2 times') || freq.includes('twice')) {
    timingSchedule = dict.bd;
  } else if (freq.includes('od') || freq.includes('once daily') || freq.includes('1 time')) {
    if (freq.includes('ac') || freq.includes('empty stomach') || freq.includes('before breakfast')) {
      timingSchedule = dict.odAc;
      mealAdvice = dict.mealBefore;
    } else if (freq.includes('hs') || freq.includes('bedtime') || freq.includes('night')) {
      timingSchedule = dict.odHs;
      mealAdvice = dict.mealAfter;
    } else {
      timingSchedule = dict.odPc;
    }
  } else if (freq.includes('sos') || freq.includes('prn') || freq.includes('as needed')) {
    timingSchedule = dict.sos;
  }

  return {
    language: targetLang,
    timingSchedule,
    dosageInstructions: timingSchedule,
    mealAdvice,
  };
}
