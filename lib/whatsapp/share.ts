import { Prescription, Patient, MedicineItem } from '@/types';
import { formatDate } from '@/lib/utils';

/**
 * Translates standard medical frequency codes into patient-friendly Regional Hindi & English instructions
 */
export function translateFrequencyToRegional(frequency: string): {
  hindi: string;
  timing: string;
} {
  const freq = frequency.toLowerCase();

  if (freq.includes('tid') || freq.includes('tds') || freq.includes('3 times')) {
    return {
      hindi: 'दिन में 3 बार (सुबह - दोपहर - रात)',
      timing: 'Morning ☀️ / Afternoon 🌤️ / Night 🌙',
    };
  }
  if (freq.includes('bd') || freq.includes('bid') || freq.includes('2 times') || freq.includes('twice')) {
    return {
      hindi: 'दिन में 2 बार (सुबह और रात खाने के बाद)',
      timing: 'Morning ☀️ & Night 🌙 (After Meals)',
    };
  }
  if (freq.includes('od') || freq.includes('once daily') || freq.includes('1 time')) {
    if (freq.includes('ac') || freq.includes('before breakfast') || freq.includes('empty stomach')) {
      return {
        hindi: 'दिन में 1 बार (सुबह खाली पेट)',
        timing: 'Morning ☀️ (Empty Stomach / Before Food)',
      };
    }
    if (freq.includes('hs') || freq.includes('bedtime') || freq.includes('night')) {
      return {
        hindi: 'दिन में 1 बार (रात को सोने से पहले)',
        timing: 'Night 🌙 (At Bedtime)',
      };
    }
    return {
      hindi: 'दिन में 1 बार (सुबह नाश्ते के बाद)',
      timing: 'Once Daily (Morning after food)',
    };
  }
  if (freq.includes('sos') || freq.includes('prn') || freq.includes('as needed') || freq.includes('fever')) {
    return {
      hindi: 'ज़रूरत पड़ने पर (जैसे बुखार या दर्द होने पर)',
      timing: 'As Needed (SOS for Fever / Pain)',
    };
  }

  return {
    hindi: 'डॉक्टर की सलाह अनुसार लें',
    timing: frequency,
  };
}

/**
 * Generate formatted WhatsApp message text with patient demographics, structured meds & Hindi schedule
 */
export function formatPrescriptionWhatsAppMessage(
  prescription: Prescription,
  patient?: Patient | null,
  clinicName: string = 'ClinicOCR Medical Centre'
): string {
  const patientName = patient?.name || prescription.patientName || 'Valued Patient';
  const dateStr = formatDate(prescription.createdAt);

  let message = `🏥 *${clinicName.toUpperCase()}*\n`;
  message += `📋 *Official Digital Prescription & Dosage Schedule*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `👤 *Patient:* ${patientName}\n`;
  if (patient?.age) message += `🎂 *Age/Gender:* ${patient.age} yrs (${patient.gender})\n`;
  message += `📅 *Date:* ${dateStr}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (prescription.aiSummary) {
    message += `🩺 *Clinical Summary / Diagnosis:*\n_${prescription.aiSummary}_\n\n`;
  }

  message += `💊 *PRESCRIBED MEDICINES (दवाइयों का विवरण):*\n`;

  const meds = prescription.medicinesJson || [];
  if (meds.length === 0) {
    message += `_No specific medications listed._\n`;
  } else {
    meds.forEach((med, idx) => {
      const { hindi, timing } = translateFrequencyToRegional(med.frequency || '');
      message += `\n*${idx + 1}. ${med.name}* (${med.dosage || 'Standard Dosage'})\n`;
      message += `   ⏱️ *Schedule:* ${timing}\n`;
      message += `   🇮🇳 *निर्देश:* ${hindi}\n`;
    });
  }

  if (prescription.doctorNotes) {
    message += `\n📝 *Doctor's Advice (सलाह):*\n_${prescription.doctorNotes}_\n`;
  }

  message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `⚠️ *Note:* Take medications as directed. Please maintain hydration and consult the doctor if symptoms persist.\n`;
  message += `✨ _Digitized & Verified with ClinicOCR Medical Intelligence_`;

  return message;
}

/**
 * Create a direct WhatsApp web/app link for the patient's phone number
 */
export function generateWhatsAppLink(
  phoneNumber: string,
  prescription: Prescription,
  patient?: Patient | null,
  clinicName?: string
): string {
  // Clean phone number: remove spaces, dashes, brackets, leading +
  const cleanPhone = (phoneNumber || patient?.phone || '').replace(/[^0-9]/g, '');
  const formattedText = formatPrescriptionWhatsAppMessage(prescription, patient, clinicName);

  if (cleanPhone.length >= 10) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formattedText)}`;
  }

  return `https://wa.me/?text=${encodeURIComponent(formattedText)}`;
}
