import { getPatients } from "@/actions/patients";
import { Header } from "@/components/layout/header";
import { UploadPageView } from "./upload-page-view";

export default async function UploadPage() {
  const patients = await getPatients();

  return (
    <div>
      <Header
        title="AI Prescription Scanner & Digitizer"
        subtitle="Capture or upload handwritten prescriptions for dual-stage OCR & Gemini analysis"
      />

      <div className="p-8">
        <UploadPageView initialPatients={patients} />
      </div>
    </div>
  );
}
