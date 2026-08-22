import jsPDF from 'jspdf';
import { Prescription, Patient } from '@/types';
import { formatDate } from '@/lib/utils';
import { findGenericAlternative } from '@/lib/clinical/safety';
import { translateFrequencyToRegional } from '@/lib/whatsapp/share';

export function generatePrescriptionPDF(
  prescription: Prescription,
  patient?: Patient | null,
  clinicName: string = 'ClinicOCR Medical Centre'
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Banner
  doc.setFillColor(2, 132, 199); // Medical cyan-blue #0284c7
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Clinic Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(clinicName.toUpperCase(), 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Smart Medical Document Intelligence | Digital Record', 14, 18);
  doc.text(`Generated: ${formatDate(new Date())}`, pageWidth - 14, 18, { align: 'right' });

  y = 38;

  // Patient Info Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, y, pageWidth - 24, 26, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Patient: ${patient?.name || prescription.patientName || 'Unknown Patient'}`, 18, y + 8);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Age: ${patient?.age || 'N/A'} yrs   |   Gender: ${patient?.gender || 'N/A'}   |   Phone: ${patient?.phone || prescription.patientPhone || 'N/A'}`, 18, y + 16);
  doc.text(`Prescription Date: ${formatDate(prescription.createdAt)}`, pageWidth - 18, y + 16, { align: 'right' });

  y += 34;

  // Clinical Summary Section
  if (prescription.aiSummary) {
    doc.setTextColor(2, 132, 199);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CLINICAL SUMMARY & DIAGNOSIS', 14, y);
    y += 5;

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const splitSummary = doc.splitTextToSize(prescription.aiSummary, pageWidth - 28);
    doc.text(splitSummary, 14, y);
    y += splitSummary.length * 5 + 6;
  }

  // Medicines Table
  doc.setTextColor(2, 132, 199);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PRESCRIBED MEDICATIONS & DOSAGE SCHEDULE (Rx)', 14, y);
  y += 5;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(12, y, pageWidth - 24, 8, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('#', 15, y + 5.5);
  doc.text('Medicine / Generic Composition', 22, y + 5.5);
  doc.text('Dosage', 100, y + 5.5);
  doc.text('Schedule & Timing (दवाइयों का समय)', 132, y + 5.5);
  y += 9;

  const meds = prescription.medicinesJson || [];
  if (meds.length === 0) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text('No specific medicines structured.', 18, y + 5);
    y += 10;
  } else {
    meds.forEach((med, idx) => {
      const genericAlt = findGenericAlternative(med.name);
      const { timing } = translateFrequencyToRegional(med.frequency || '');

      doc.setFillColor(idx % 2 === 0 ? 255 : 248, 250, 252);
      doc.rect(12, y, pageWidth - 24, 11, 'F');
      
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${idx + 1}.`, 15, y + 5);
      doc.text(med.name || '-', 22, y + 5);

      if (genericAlt) {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(5, 150, 105);
        doc.text(`Generic: ${genericAlt.genericName.slice(0, 38)}`, 22, y + 9);
      }

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      doc.text(med.dosage || '-', 100, y + 5);
      doc.text(med.frequency || '-', 132, y + 5);

      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`[${timing}]`, 132, y + 9);

      y += 12;
    });
  }

  y += 6;

  // Doctor Notes & Clinical Advice
  if (prescription.doctorNotes) {
    doc.setTextColor(2, 132, 199);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PHYSICIAN NOTES & PATIENT ADVICE (सलाह)', 14, y);
    y += 5;

    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    const splitNotes = doc.splitTextToSize(prescription.doctorNotes, pageWidth - 32);
    const boxHeight = splitNotes.length * 4.5 + 8;
    doc.roundedRect(12, y, pageWidth - 24, boxHeight, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(153, 27, 27);
    doc.text(splitNotes, 16, y + 6);
    y += boxHeight + 8;
  }

  // Tags
  if (prescription.tags && prescription.tags.length > 0) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(`Clinical Categories: ${prescription.tags.join(', ')}`, 14, y);
    y += 8;
  }

  // Doctor Sign-off Footer
  const footerY = Math.max(y + 10, doc.internal.pageSize.getHeight() - 28);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, footerY, 70, footerY);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text("Authorized Doctor's Signature", 14, footerY + 5);

  doc.setFontSize(7.5);
  doc.text('Digitized & Verified with ClinicOCR Medical Document Intelligence', pageWidth - 14, footerY + 5, { align: 'right' });

  return doc;
}
