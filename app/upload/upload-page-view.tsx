"use client";

import { useState } from "react";
import { Patient, AnalysisPipelineResponse } from "@/types";
import { ImageUploader } from "@/components/upload/image-uploader";
import { DoctorReviewStudio } from "@/components/upload/doctor-review-studio";

interface UploadPageViewProps {
  initialPatients: Patient[];
}

export function UploadPageView({ initialPatients }: UploadPageViewProps) {
  const [analysisResult, setAnalysisResult] = useState<{
    analysis: AnalysisPipelineResponse;
    selectedPatient: Patient;
    imageUrl: string;
  } | null>(null);

  const handleAnalysisComplete = (result: {
    analysis: AnalysisPipelineResponse;
    selectedPatient: Patient;
    imageUrl: string;
  }) => {
    setAnalysisResult(result);
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div>
      {analysisResult ? (
        <DoctorReviewStudio
          initialResult={analysisResult}
          onReset={handleReset}
        />
      ) : (
        <ImageUploader
          patients={initialPatients}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}
    </div>
  );
}
