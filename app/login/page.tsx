import { Metadata } from "next";
import { LoginClientView } from "./login-client";

export const metadata: Metadata = {
  title: "Unified Healthcare Login | GramArogya — Govt. of Maharashtra",
  description: "Secure multi-role authentication portal for Doctors, Medical Store Workers, and Patients/Citizens under Public Health Department, Govt. of Maharashtra.",
};

export default function LoginPage() {
  return <LoginClientView />;
}
