"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Stethoscope, 
  Pill, 
  User, 
  ShieldCheck, 
  Lock, 
  Phone, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Hospital, 
  Building2, 
  Globe, 
  KeyRound, 
  Fingerprint, 
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type LoginRole = "doctor" | "pharmacist" | "patient";

export function LoginClientView() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<LoginRole>("doctor");
  const [selectedLanguage, setSelectedLanguage] = useState<"mr" | "hi" | "en">("mr");
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [identifier, setIdentifier] = useState("MMC-2024-88421"); // Doctor Reg / Kendra ID / ABHA
  const [passwordOrOtp, setPasswordOrOtp] = useState("••••••••");
  const [facilityName, setFacilityName] = useState("Khed Model Primary Health Centre");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleRoleChange = (role: LoginRole) => {
    setActiveRole(role);
    setIsOtpSent(false);
    if (role === "doctor") {
      setIdentifier("MMC-2024-88421");
      setFacilityName("Khed Model Primary Health Centre (PHC)");
    } else if (role === "pharmacist") {
      setIdentifier("PMBJP-MH-PUNE-104");
      setFacilityName("Pradhan Mantri Jan Aushadhi Kendra - Khed");
    } else {
      setIdentifier("91-4521-8842-1092"); // 14 digit ABHA
      setFacilityName("Gram Panchayat Ward 4");
    }
  };

  const handleSendOtp = () => {
    setIsOtpSent(true);
    toast.success("🔐 6-Digit OTP sent to registered mobile (+91 98*** ****8) via Ayushman Bharat SMS Gateway!");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (activeRole === "doctor") {
        toast.success("Welcome, Dr. Rajesh Kulkarni (MD)! Logged in with NMC Practitioner Credentials.");
        router.push("/teleconsult");
      } else if (activeRole === "pharmacist") {
        toast.success("Welcome, Pharmacist Sachin! Logged in to Jan Aushadhi Kendra Inventory Portal.");
        router.push("/pharmacy");
      } else {
        toast.success("Welcome, Sunita Shinde! ABHA Digital Health Locker Authenticated.");
        router.push("/dashboard");
      }
    }, 1200);
  };

  const handleQuickDemoLogin = (role: LoginRole) => {
    handleRoleChange(role);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === "doctor") {
        toast.success("🚀 1-Click Demo: Logged in as Dr. Anand Joshi (Specialist Doctor)");
        router.push("/teleconsult");
      } else if (role === "pharmacist") {
        toast.success("🚀 1-Click Demo: Logged in as Jan Aushadhi Store Manager");
        router.push("/pharmacy");
      } else {
        toast.success("🚀 1-Click Demo: Logged in as Citizen / ASHA Facilitator");
        router.push("/dashboard");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md flex items-center justify-center">
            <Image
              src="/maharashtra_arogya_logo.png"
              alt="Public Health Department Maharashtra"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                Gram<span className="text-emerald-400">Arogya</span>
              </span>
              <Badge variant="outline" className="text-[9px] border-emerald-400/40 text-emerald-300 font-bold uppercase">
                Govt. of Maharashtra
              </Badge>
            </div>
            <p className="text-[10px] text-slate-400 font-medium -mt-0.5">
              सार्वजनिक आरोग्य विभाग • National Health Mission Portal
            </p>
          </div>
        </div>

        {/* Vernacular Language Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700 rounded-xl p-1 text-xs">
          <button
            onClick={() => setSelectedLanguage("mr")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              selectedLanguage === "mr"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            मराठी
          </button>
          <button
            onClick={() => setSelectedLanguage("hi")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              selectedLanguage === "hi"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setSelectedLanguage("en")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              selectedLanguage === "en"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            English
          </button>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-6 z-10">
        
        {/* Left Side: Official Government Logo & Mission Branding */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
          
          {/* Government Logo Display Card */}
          <div className="p-6 rounded-3xl bg-white text-slate-900 shadow-2xl border-4 border-emerald-500/30 flex flex-col items-center text-center space-y-4">
            <div className="relative w-48 h-36">
              <Image
                src="/maharashtra_arogya_logo.png"
                alt="संकल्प निरोगी महाराष्ट्राचा - सार्वजनिक आरोग्य विभाग, महाराष्ट्र शासन"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-base font-black text-rose-700 tracking-tight">
                संकल्प निरोगी महाराष्ट्राचा
              </h2>
              <p className="text-xs font-bold text-slate-700">
                सार्वजनिक आरोग्य विभाग, महाराष्ट्र शासन
              </p>
              <p className="text-[11px] text-slate-500">
                Public Health Department, Government of Maharashtra
              </p>
            </div>

            <div className="w-full pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-600">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
                <span>36 Districts</span>
              </div>
              <div className="p-1.5 rounded-lg bg-sky-50 text-sky-800">
                <span>ABHA Linked</span>
              </div>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-800">
                <span>Jan Aushadhi</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ayushman Bharat Digital Mission (ABDM) & DISHA Compliant</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unified Single Sign-On (SSO) gateway for rural teleconsultations, frontline ASHA triage, medicine stock management, and patient health wallets.
            </p>
          </div>
        </div>

        {/* Right Side: Role Selector & Login Form */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 backdrop-blur-xl shadow-2xl rounded-3xl space-y-6">
            
            {/* Role Switcher Tabs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  {selectedLanguage === "mr" ? "तुमची भूमिका निवडा (Select Role)" : "Select Your Portal Role"}
                </label>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  3 Role Access
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                
                {/* Role 1: Doctor */}
                <button
                  type="button"
                  onClick={() => handleRoleChange("doctor")}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    activeRole === "doctor"
                      ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  }`}
                >
                  <Stethoscope className="w-4 h-4 shrink-0" />
                  <span>{selectedLanguage === "mr" ? "डॉक्टर" : "Doctor"}</span>
                </button>

                {/* Role 2: Medical Store / Pharmacist */}
                <button
                  type="button"
                  onClick={() => handleRoleChange("pharmacist")}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    activeRole === "pharmacist"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  }`}
                >
                  <Pill className="w-4 h-4 shrink-0" />
                  <span>{selectedLanguage === "mr" ? "औषध भांडार" : "Medical Store"}</span>
                </button>

                {/* Role 3: Patient / Citizen */}
                <button
                  type="button"
                  onClick={() => handleRoleChange("patient")}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    activeRole === "patient"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span>{selectedLanguage === "mr" ? "रुग्ण / नागरिक" : "Patient / Citizen"}</span>
                </button>
              </div>
            </div>

            {/* Dynamic Role Banner */}
            <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between ${
              activeRole === "doctor"
                ? "bg-sky-950/40 border-sky-800/80 text-sky-200"
                : activeRole === "pharmacist"
                ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-200"
                : "bg-purple-950/40 border-purple-800/80 text-purple-200"
            }`}>
              <div className="flex items-center gap-2">
                {activeRole === "doctor" && <Hospital className="w-4 h-4 text-sky-400" />}
                {activeRole === "pharmacist" && <Building2 className="w-4 h-4 text-emerald-400" />}
                {activeRole === "patient" && <Fingerprint className="w-4 h-4 text-purple-400" />}
                <div>
                  <strong className="block font-bold">
                    {activeRole === "doctor" && (selectedLanguage === "mr" ? "वैद्यकीय अधिकारी / तज्ज्ञ डॉक्टर पोर्टल" : "Medical Officer / Specialist Doctor Portal")}
                    {activeRole === "pharmacist" && (selectedLanguage === "mr" ? "जन औषधी केंद्र व फार्मसी डिस्पेंसर" : "Jan Aushadhi Kendra & Pharmacy Store Portal")}
                    {activeRole === "patient" && (selectedLanguage === "mr" ? "आयुष्मान भारत डिजिटल हेल्थ लॉकर व आशा सहाय्य" : "ABHA Citizen Health Locker & ASHA Triage")}
                  </strong>
                  <span className="text-[10px] opacity-80">{facilityName}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin(activeRole)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] transition-colors flex items-center gap-1 shrink-0"
              >
                <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                1-Click Demo
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Field 1: Identifier */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {activeRole === "doctor" && (selectedLanguage === "mr" ? "महाराष्ट्र मेडिकल कौन्सिल (MMC) नोंदणी क्रमांक किंवा ABHA ID" : "Maharashtra Medical Council (MMC) Reg No. or ABHA ID")}
                  {activeRole === "pharmacist" && (selectedLanguage === "mr" ? "जन औषधी केंद्र / मेडिकल स्टोअर परवाना क्रमांक" : "PMBJP Jan Aushadhi Kendra ID / Drug License No.")}
                  {activeRole === "patient" && (selectedLanguage === "mr" ? "१४-अंकी ABHA क्रमांक किंवा आधार लिंक मोबाईल क्रमांक" : "14-Digit ABHA Number or Aadhaar Mobile Number")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    {activeRole === "doctor" ? <Stethoscope className="w-4 h-4" /> : activeRole === "pharmacist" ? <CreditCard className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      activeRole === "doctor"
                        ? "e.g. MMC-2024-88421"
                        : activeRole === "pharmacist"
                        ? "e.g. PMBJP-MH-PUNE-104"
                        : "e.g. 91-4521-8842-1092"
                    }
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-800/80 p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                </div>
              </div>

              {/* Field 2: Password or OTP */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {activeRole === "patient"
                      ? (selectedLanguage === "mr" ? "ओटीपी (One Time Password)" : "6-Digit Aadhaar/ABHA OTP")
                      : (selectedLanguage === "mr" ? "पासवर्ड किंवा डिजिटल सुरक्षा पिन" : "Password or Digital NMC Security Pin")}
                  </label>
                  {activeRole === "patient" && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[11px] font-bold text-emerald-400 hover:underline"
                    >
                      {isOtpSent ? "Resend OTP" : "Get OTP on Mobile"}
                    </button>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={passwordOrOtp}
                    onChange={(e) => setPasswordOrOtp(e.target.value)}
                    placeholder={activeRole === "patient" ? "Enter 6-Digit OTP" : "Enter Password"}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-800/80 p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-xl font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                  activeRole === "doctor"
                    ? "bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/30"
                    : activeRole === "pharmacist"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30"
                    : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/30"
                }`}
              >
                {isLoading ? (
                  <span>Authenticating Credentials...</span>
                ) : (
                  <>
                    <span>
                      {activeRole === "doctor" && (selectedLanguage === "mr" ? "डॉक्टर पोर्टल मध्ये प्रवेश करा" : "Login to Doctor Consultation Portal")}
                      {activeRole === "pharmacist" && (selectedLanguage === "mr" ? "औषध भांडार पोर्टल मध्ये प्रवेश करा" : "Login to Pharmacy & Stock Portal")}
                      {activeRole === "patient" && (selectedLanguage === "mr" ? "आरोग्य लॉकर मध्ये प्रवेश करा" : "Access Citizen Health Locker")}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Quick Demo Credentials Footer Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Demo Pass: Any password / 1-Click login supported</span>
              </div>
              <Link href="/dashboard" className="text-emerald-400 font-bold hover:underline">
                Skip to Dashboard →
              </Link>
            </div>

          </Card>
        </div>

      </main>

      {/* Footer Credentials & Compliance */}
      <footer className="max-w-6xl w-full mx-auto pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 z-10">
        <p>
          © 2026 GramArogya • Public Health Department, Government of Maharashtra (PS 26133)
        </p>
        <div className="flex items-center gap-4 text-[10px]">
          <span>🔒 256-Bit SSL Encryption</span>
          <span>🛡️ HIPAA & DISHA Compliant</span>
          <span>🇮🇳 ABDM Integrated</span>
        </div>
      </footer>

    </div>
  );
}
