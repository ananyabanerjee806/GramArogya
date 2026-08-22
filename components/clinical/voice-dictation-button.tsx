"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface VoiceDictationButtonProps {
  onTranscriptReceived: (transcript: string) => void;
  className?: string;
}

export function VoiceDictationButton({
  onTranscriptReceived,
  className,
}: VoiceDictationButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN"; // Supports Indian English & medical terms

    recognition.onresult = (event: any) => {
      let current = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      setTranscript(current);
      if (event.results[event.results.length - 1].isFinal) {
        onTranscriptReceived(current);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition notice:", event.error);
      if (event.error !== "no-speech") {
        toast.error(`Dictation notice: ${event.error}`);
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscriptReceived]);

  const toggleListening = () => {
    if (!isSupported) {
      toast.error("Voice dictation is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      toast.success("Voice dictation stopped. Prescription updated.");
    } else {
      setTranscript("");
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        toast.info("🎙️ Listening... Dictate medicine, dosage, or instructions (e.g. 'Tab Amoxicillin 500mg TDS for 5 days')");
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Button
        type="button"
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        onClick={toggleListening}
        className={`gap-1.5 text-xs font-semibold transition-all ${
          isListening
            ? "animate-pulse ring-2 ring-rose-500 shadow-md"
            : "text-slate-700 border-slate-300 hover:bg-sky-50 hover:text-sky-700"
        } ${className || ""}`}
        title={isListening ? "Stop Voice Dictation" : "Start Voice Dictation"}
      >
        {isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5 animate-bounce text-white" />
            <span>Listening (Stop)</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-sky-600" />
            <span>AI Voice Dictate</span>
          </>
        )}
      </Button>

      {isListening && (
        <span className="text-[11px] font-medium text-rose-600 flex items-center gap-1 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
          Speak clearly...
        </span>
      )}
    </div>
  );
}
