# GramArogya

> **AI-Assisted Rural Healthcare Referral, Document Intelligence & Continuity of Care Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?style=flat-square)](https://orm.drizzle.team/)
[![Neon Database](https://img.shields.io/badge/Neon_PostgreSQL-Serverless-00E599?style=flat-square)](https://neon.tech/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=flat-square&logo=google)](https://ai.google.dev/)
[![Tesseract.js](https://img.shields.io/badge/Tesseract.js-7.0-brightgreen?style=flat-square)](https://github.com/naptha/tesseract.js)

---

## Overview

**GramArogya** is an open-source digital health platform prototype designed to improve healthcare delivery, clinical triage, document digitization, and referral coordination across rural and semi-urban health tiers—from Sub-Centres / Ayushman Arogya Mandirs to Primary Health Centres (PHCs), Community Health Centres (CHCs), and District Hospitals.

The platform integrates an offline-capable optical character recognition (OCR) and multimodal generative AI pipeline to digitize handwritten clinical prescriptions in seconds, structured clinical triage scoring for frontline workers (ASHAs/ANMs), referral coordination tracking, teleconsultation queues, essential medicine tracking with Jan Aushadhi generic drug mapping, and maternal/chronic disease follow-up tracking.

> **Current Project Status (Prototype / MVP)**:  
> GramArogya is designed around the vision:  
> *"A closed-loop rural referral platform that ensures a patient is not merely referred, but accepted by a capable facility and tracked until care completion."*  
> The current repository is a **functional prototype and reference implementation** prepared for demonstration, research. It implements the core user interfaces, AI/OCR pipelines, referral state transitions, rule engines, and dual in-memory/PostgreSQL data persistence. It does **not** claim live production integration with government databases, hardware GPS dispatch feeds, or certified ABDM live gateways.

---

## Problem

Rural healthcare ecosystems in India and developing regions face critical friction points:

1. **Broken Referral Loops**: When frontline workers or PHCs refer high-risk patients (e.g., severe maternal anemia, hypertensive urgency, neonatal distress) to secondary or tertiary facilities, referrals are frequently unconfirmed. Patients often arrive at facilities lacking required specialists, available beds, or diagnostics, leading to preventable delays and referral fatigue.
2. **Illegible Handwritten Records**: Prescriptions and triage notes remain paper-based, causing medication errors, lost longitudinal patient histories, and lack of continuity across health tiers.
3. **Medication Affordability Gap**: Patients often purchase expensive branded medicines when bioequivalent, highly subsidized alternatives are available through the Pradhan Mantri Bharatiya Janaushadhi Pariyojana (PMBJP).
4. **Follow-Up Drop-Offs (Care Debt)**: Patients with chronic conditions (hypertension, diabetes) or high-risk pregnancies miss vital follow-ups, with no automated tracking mechanism for ASHA workers to intervene proactively.

---

## Current Solution

GramArogya addresses these challenges through a modular web application:

### Status Matrix

| Component | Status | Description |
| :--- | :---: | :--- |
| **Prescription OCR & AI Structuring** | **Implemented** | Image preprocessing (`Sharp`), OCR text extraction (`Tesseract.js`), and clinical entity extraction (`Google Gemini 2.5 Flash` or local rule-based fallback). |
| **Doctor Review Studio** | **Implemented** | Interactive verification UI with confidence badges, medicine dosage/timing editors, generic drug savings calculation, and digital sign-off. |
| **AI Clinical Triage** | **Implemented** | Vitals and chief complaint logging, risk stratification (`RED` / `YELLOW` / `GREEN`), AI recommendations, and immediate emergency escalation flags. |
| **Referral Management** | **Implemented (MVP)** | Referral generation, urgency classification (`EMERGENCY_108`, `URGENT_24H`, `ROUTINE`), escort logging, and status transitions (`INITIATED`, `IN_TRANSIT`, `ADMITTED`, `COMPLETED`). |
| **Patient & ABHA Registry** | **Implemented** | Patient profiles, 14-digit ABHA ID formatting, village/district tagging, emergency contacts, and high-risk flags. |
| **Teleconsultation & OPD Queue** | **Implemented** | Token management, specialist teleconsultation session logging, digital notes, and real-time wait estimation. |
| **Essential Drugs & Jan Aushadhi** | **Implemented** | PHC stock levels, low-stock alerts, generic medicine price comparisons (80%+ savings), and Jan Aushadhi Kendra directory. |
| **Maternal & NCD Tracking** | **Implemented** | High-risk ANC/PNC and chronic disease registries, trimester/stage records, risk factors, and automated follow-up day calculation. |
| **District Facility Analytics** | **Implemented** | Interactive dashboard with referral turnaround metrics, maternal compliance rates, stockout alerts, and disease prevalence breakdowns. |
| **CareRoute & CareDebt Engines** | **Implemented (Logic)** | Algorithmic matching for facility suitability and rules for identifying missed referral care debts. |
| **Regional Translation Engine** | **Implemented** | Translates prescription dosage and meal timings into 6 languages (English, Hindi, Marathi, Tamil, Bengali, Telugu). |
| **WhatsApp & PDF Export** | **Implemented** | Shareable regional prescription summaries via WhatsApp and client-side PDF document generation. |
| **Live ABDM Sandbox API Bridge** | *Planned* | Official National Health Authority (NHA) FHIR bundle exchange & M1/M2/M3 gateway certification. |
| **Real-time 108 GPS Hardware Feed** | *Planned* | Direct IoT telemetry from state emergency ambulance fleets. |
| **Live Hospital Bed Telemetry** | *Planned* | Integration with real-time ICU/oxygen sensor networks. |

---

## Core Implemented Workflow

```mermaid
flowchart TD
    A(["Patient Visit / ASHA Home Visit"]) --> B["AI Triage & Vitals Logging"]
    B --> C{"Triage Assessment"}
    
    C -->|RED: Emergency| D["108 Emergency Referral Created"]
    C -->|YELLOW: Urgent| E["Specialist Teleconsult / PHC Escalation"]
    C -->|GREEN: Routine| F["Prescription & Local OPD Care"]

    D --> G["Referral Logged & Escort Assigned"]
    G --> H["Status: IN_TRANSIT"]
    H --> I["Status: ADMITTED / COMPLETED"]

    F --> J["Prescription Image Upload"]
    J --> K["Sharp Preprocessing + Tesseract.js OCR"]
    K --> L["Gemini 2.5 Flash / Local Rule Parser"]
    L --> M["Doctor Review Studio & Sign-Off"]
    M --> N["Jan Aushadhi Generic Substitution"]
    N --> O["WhatsApp Regional Share / PDF Export"]

    E --> P["Teleconsultation Queue"]
    P --> Q["Digital Consultation & e-Prescription"]
    Q --> M
```

---

## Features

### 1. Prescription OCR & Medical Structuring Pipeline
- **Sharp Image Preprocessing**: Evaluates image sharpness, brightness, and contrast. Enhances text readability before OCR.
- **Tesseract OCR (Client/Server)**: Extracts raw text and calculates word-level confidence scores, highlighting uncertain words (<65% confidence).
- **Google Gemini 2.5 Flash**: Parses raw OCR text to extract structured drug names, strengths, dosage frequencies (TID, BD, OD, SOS, AC, PC), clinical summaries, and danger signs.
- **Deterministic Offline Fallback**: If no Gemini API key is provided, an intelligent rule-based regex parser extracts common Indian medical terms and dosages without crashing.
- **Doctor Review Studio**: Side-by-side verification interface allowing physicians to edit medications, approve substitutions, add notes, and digitally sign.

### 2. Clinical Triage & Risk Stratification
- Fast intake form capturing systolic/diastolic blood pressure, pulse, SpO2, blood sugar, and temperature.
- Color-coded risk levels:
  - 🔴 **RED (Emergency)**: Severe hypertension, acute chest pain, fetal distress (triggers emergency ambulance escalation).
  - 🟡 **YELLOW (Urgent)**: Severe anemia, unmanaged gestational diabetes, persistent fever.
  - 🟢 **GREEN (Routine)**: Mild infections, routine prenatal checks.

### 3. Closed-Loop Referral Coordination (Prototype)
- Referral initiation linking referring facility (Sub-Centre / PHC) to receiving facility (Rural Hospital / CHC / District Hospital).
- Captures urgency, reason for transfer, required clinical specialty, assigned transport (108 Ambulance / Shuttle / Self), and escort worker name.
- Status progression: `INITIATED` ➔ `IN_TRANSIT` ➔ `ADMITTED` ➔ `COMPLETED`.

### 4. Teleconsultation & OPD Queue Management
- Queuing system generating digital token numbers for remote specialist consultations.
- Clinical session notes, digital Rx tagging, and estimated wait times.

### 5. Essential Drug Catalog & Jan Aushadhi Generic Mapping
- Real-time stock visibility for primary health centre pharmacies with stock-out warning thresholds.
- Direct mapping of expensive brand-name medications to Pradhan Mantri Jan Aushadhi alternatives, displaying price comparisons and percentage savings (often 70%–90%).
- Integrated directory of verified nearby Jan Aushadhi Kendras.

### 6. Maternal & Chronic Disease (NCD) Follow-up Tracking
- Longitudinal records for High-Risk ANC (Antenatal Care), PNC (Postnatal Care), and Chronic Non-Communicable Diseases (Hypertension, Diabetes).
- Configurable follow-up intervals with ASHA worker assignment and risk factor alerts.

### 7. Multilingual Patient Instructions & WhatsApp Sharing
- Translates medical abbreviations (e.g., `1 Tab BD PC`) into simple, conversational regional instructions (e.g., *"दिन में 2 बार (सुबह और रात खाने के बाद)"* in Hindi, Marathi, Tamil, Telugu, and Bengali).
- One-click formatted WhatsApp prescription generator for patient and family communication.

---

## Technology Stack

```
Frontend:
  - Next.js 16.3.1 (App Router, Server Actions)
  - React 19.2.8
  - TypeScript 5.x
  - Tailwind CSS v4
  - Radix UI Primitives (Dialog, Dropdown, Select, Tabs, Tooltip)
  - Lucide React (Icons)
  - Sonner (Toast notifications)
  - Canvas Confetti

Backend & Data Layer:
  - Next.js Server Actions & API Routes
  - Drizzle ORM 0.45.2
  - Neon Serverless PostgreSQL (@neondatabase/serverless 1.1.0) / pg 8.23.0
  - In-Memory Persistent Fallback Store (Zero-config development & testing)

AI / ML & OCR:
  - Google GenAI SDK (@google/genai 2.17.1) with Gemini 2.5 Flash
  - Tesseract.js 7.0.0 (WASM / Node OCR Worker)
  - Sharp 0.35.3 (High-performance image diagnostics & preprocessing)

Export & Document Utilities:
  - jsPDF 4.2.1
  - html2canvas 1.4.1
  - Zod 4.4.3 & React Hook Form
```

---

## Architecture

```mermaid
graph LR
    subgraph Client ["Client / Mobile Browser"]
        UI["Next.js App Router UI"]
        Cam["Camera / File Upload"]
        Lang["Regional Language Switcher"]
    end

    subgraph Server ["Next.js Server & Actions Layer"]
        SA["Server Actions / API Routes"]
        SharpProc["Sharp Image Preprocessing"]
        Tess["Tesseract.js OCR Engine"]
        Gemini["Google Gemini 2.5 Flash"]
        RuleEngine["Fallback & Safety Engines"]
    end

    subgraph Data ["Data Persistence"]
        MemStore["In-Memory Store (Default)"]
        NeonDB[("Neon PostgreSQL via Drizzle")]
    end

    UI -->|Uploads Image| Cam
    Cam --> SA
    SA --> SharpProc
    SharpProc --> Tess
    Tess --> Gemini
    Tess -.->|If No API Key| RuleEngine
    Gemini --> UI
    SA <--> MemStore
    SA <--> NeonDB
```

---

## Project Structure

```
ClinicOCR/
├── actions/                   # Next.js Server Actions
│   ├── analyze.ts             # OCR & AI analysis pipeline orchestration
│   ├── maternal-ncd.ts        # Maternal & Chronic NCD actions
│   ├── patients.ts            # Patient CRUD & query actions
│   ├── pharmacy.ts            # Essential drug & Jan Aushadhi actions
│   ├── prescriptions.ts       # Prescription CRUD & search actions
│   ├── referrals.ts           # Referral creation & status updates
│   ├── teleconsult.ts         # Teleconsultation sessions & OPD queue
│   └── triage.ts              # Clinical triage assessments
├── app/                       # Next.js App Router pages
│   ├── api/analyze/           # REST API endpoint for prescription OCR
│   ├── dashboard/             # Main clinical overview dashboard
│   │   ├── asha-action/       # ASHA daily action checklist
│   │   └── care-command/      # District command overview
│   ├── facility-analytics/    # Facility resource & referral analytics
│   ├── login/                 # Role portal switcher (Doctor, ASHA, Receptionist)
│   ├── maternal-ncd/          # Maternal and NCD tracking views
│   ├── patients/              # Patient registry and ABHA details
│   ├── pharmacy/              # Pharmacy stock & Jan Aushadhi finder
│   ├── prescriptions/         # Prescription search & filter gallery
│   ├── queue/                 # OPD waiting queue
│   ├── referrals/             # Referral tracking and dispatch
│   ├── teleconsult/           # Teleconsultation session console
│   ├── triage/                # Frontline triage and vitals input
│   ├── upload/                # Image upload & Doctor Review Studio
│   ├── layout.tsx             # Root application layout & shell
│   └── page.tsx               # Redirect to dashboard
├── components/                # React UI Components
│   ├── abha/                  # ABHA ID badges and QR previews
│   ├── camera/                # Web camera capture interface
│   ├── layout/                # App shell, sidebar, and headers
│   ├── ui/                    # Reusable UI primitives (buttons, dialogs, cards)
│   └── upload/                # Review studio, image uploader, quality indicators
├── db/                        # Database schema & connection
│   ├── index.ts               # Dual-mode connection (Neon DB or In-Memory Store)
│   ├── schema.ts              # Drizzle ORM PostgreSQL schema
│   └── seed.ts                # Database seeder for demo data
├── lib/                       # Utility modules & engines
│   ├── abha/abdm.ts           # ABHA formatting and validation helpers
│   ├── auth/rbac.ts           # Role-based profiles & permissions matrix
│   ├── clinical/              # Safety rules, drug interactions, translations
│   ├── engines/               # CareRoute & CareDebt rule engines
│   ├── ocr/                   # Tesseract, Gemini, and Sharp processors
│   ├── pdf/export.ts          # PDF generation utilities
│   └── whatsapp/share.ts      # WhatsApp message structuring
├── drizzle.config.ts          # Drizzle Kit configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: Version `18.17.0` or higher (Node 20+ recommended)
- **npm**, **yarn**, or **pnpm**
- **Git**

### 2. Clone Repository
```bash
git clone https://github.com/your-org/GramArogya.git
cd GramArogya/ClinicOCR
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root of the project:

```bash
# Optional: Neon PostgreSQL Connection URL.
# If omitted, GramArogya runs seamlessly using its built-in in-memory demo store.
DATABASE_URL=postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/gramarogya?sslmode=require

# Optional: Google Gemini API Key for multimodal medical structuring.
# If omitted, GramArogya automatically falls back to its local medical rule parser.
GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. Database Setup (Optional)
If you are using Neon PostgreSQL with `DATABASE_URL`:
```bash
# Push schema to database
npx drizzle-kit push

# (Optional) Seed the database with sample rural health records
npx tsx db/seed.ts
```
*(If `DATABASE_URL` is omitted, the app starts immediately with pre-loaded sample patients, referrals, and prescriptions in memory).*

### 6. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Production Build
```bash
npm run build
npm run start
```

---

## Environment Variables

| Variable | Purpose | Required | Default / Behavior if Missing |
| :--- | :--- | :---: | :--- |
| `DATABASE_URL` | PostgreSQL connection string (Neon or standard Postgres). | **No** | If unset, the app uses an in-memory store initialized with realistic sample data. |
| `GEMINI_API_KEY` | Google Gemini API key for structured prescription intelligence (`gemini-2.5-flash`). | **No** | If unset, the application uses an internal rule-based regex parser for offline/demo operation. |

> 🔒 **Security Notice**: Never commit `.env` or real API keys to version control. The repository `.gitignore` is configured to ignore `.env*` files.

---

## API & Server Actions

### Core REST API
- `POST /api/analyze`: Accepts multipart form data with image file or base64 JSON payload. Executes Sharp preprocessing, Tesseract OCR, and Gemini structuring. Returns word-level confidence and structured JSON.

### Server Actions
- **Prescription Intelligence** (`actions/analyze.ts`, `actions/prescriptions.ts`):
  - `analyzePrescriptionAction(formData)`: Server action executing the 3-stage OCR/AI pipeline.
  - `getPrescriptions(filters)`: Search, filter by patient, drug name, or date range.
  - `createPrescription(data)`: Save verified prescription to DB/store.
- **Referral Coordination** (`actions/referrals.ts`):
  - `getReferrals()`: Retrieve all active and completed referrals.
  - `createReferral(data)`: Create referral with urgency level, escort, and transport.
  - `updateReferralStatus(id, status)`: Transition status (`INITIATED`, `IN_TRANSIT`, `ADMITTED`, `COMPLETED`).
- **Clinical Triage** (`actions/triage.ts`):
  - `getTriageAssessments()`: Fetch historical triage assessments.
  - `createTriageAssessment(data)`: Log vitals, compute risk score, and save recommendations.
- **Patient Registry** (`actions/patients.ts`):
  - `getPatients(query)`: Search patients with prescription counts.
  - `createPatient(data)`: Register new patient with ABHA ID.
- **Teleconsultation & OPD** (`actions/teleconsult.ts`):
  - `getTeleconsultations()`, `createTeleconsultationSession(data)`: Token generation and specialist queue.
- **Pharmacy & Jan Aushadhi** (`actions/pharmacy.ts`):
  - `getEssentialDrugs()`: List PHC stock and Jan Aushadhi alternatives.
  - `getJanAushadhiKendras()`: Directory of nearby generic medicine outlets.
- **Maternal & NCD Tracking** (`actions/maternal-ncd.ts`):
  - `getMaternalNcdRecords()`, `createMaternalNcdRecord(data)`: ANC/PNC and chronic follow-up tracking.

---

## AI / OCR Pipeline

GramArogya implements a 3-stage pipeline:

```
[Prescription Image]
        │
        ▼
1. Sharp Preprocessing (Image quality diagnostics, contrast & greyscale enhancement)
        │
        ▼
2. Tesseract.js (Extracts raw text, flags words with <65% confidence)
        │
        ▼
3. Google Gemini 2.5 Flash (Structured JSON extraction with strict clinical safety prompts)
   └── (Fallback: Local Medical Rule Parser if API key unavailable)
        │
        ▼
4. Doctor Review Studio (Physician validation & sign-off)
```

1. **Preprocessing**: Diagnoses blur, lighting, and aspect ratios using Sharp.
2. **OCR Engine**: Tesseract.js runs character recognition to provide word-level confidence scores.
3. **Multimodal LLM (`gemini-2.5-flash`)**:
   - **Input**: Raw OCR text + Base64 image buffer.
   - **System Instruction**: Strict clinical schema rules (never hallucinate missing drugs, prefix uncertain items with *"Possibly"*, extract strength/timing/frequency, generate clinical summary).
   - **Output**: Valid JSON containing `medicines[]`, `corrected_text`, `summary`, `important_findings[]`, and `tags[]`.
4. **Offline Rule Parser**: Regex-based clinical parser capable of identifying standard Indian formulations (Paracetamol, Amoxicillin, Pantoprazole, IFA, Metformin, etc.) when internet access or API credentials are unavailable.

---

## Security & Privacy

- **No Plaintext Credential Exposure**: All database and AI keys are accessed strictly via server-side environment variables.
- **Role-Based Access Control (RBAC)**: Defined role permissions matrix (`lib/auth/rbac.ts`) for Doctors, Front-Desk Receptionists, and Pharmacists.
- **Validation**: Strict schema constraints and type validation via TypeScript and Drizzle ORM.
- **Input Sanitization**: Client-uploaded images are processed in-memory as buffers and capped via Next.js server actions body limits (`25mb`).

> **Privacy Notice**: This is an open-source prototype. It does not currently claim official certification under ABDM / DPDP Act / HIPAA. When deploying in clinical settings, adhere to local health data governance protocols.

---

## Current Limitations

GramArogya is an active prototype with known scope boundaries:

- **No Live ABDM Production Keys**: ABHA profile formatting and validation are implemented client/server side, but the codebase does not include production NHA gateway cryptographic key pairs.
- **Simulated Ambulance Telemetry**: Ambulance tracking IDs and GPS statuses are simulated for demonstration rather than connected to live state emergency CAD (Computer Aided Dispatch) hardware.
- **Single-Tenant Prototype Authentication**: The prototype includes a multi-profile role switcher for evaluation; production deployment requires integration with an enterprise identity provider (OAuth2 / OIDC / NextAuth).
- **Clinical Validation**: While rule checks and safety warnings are implemented, all AI-generated extractions require mandatory review and sign-off by a qualified medical professional.

---

## Roadmap

- [ ] **ABDM Milestone 1–3 Integration**: FHIR-compliant Health Information User (HIU) and Health Information Provider (HIP) bridge.
- [ ] **Offline-First PWA & SQLite Sync**: Complete background synchronization with IndexedDB/SQLite for remote ASHA workers operating with zero network connectivity.
- [ ] **Live Teleconsultation WebRTC**: Integrated peer-to-peer video calling with screen share and digital pen whiteboard.
- [ ] **Automated IVR / Voice Call Reminders**: Automated voice calls in local dialects for patients overdue for referral or antenatal care follow-up.
- [ ] **IoT Diagnostic Device Integrations**: Direct Bluetooth LE connectivity for pulse oximeters, digital glucometers, and digital BP cuffs.

---

## Local Demo Walkthrough

Reviewers can test the complete end-to-end flow in under 3 minutes:

1. **Start the app**: Run `npm run dev` and navigate to `http://localhost:3000`.
2. **Explore the Dashboard**: View the rural health overview with active patient counts, emergency referral alerts, and recent triage logs.
3. **Test OCR & Prescription Digitization**:
   - Go to **Scan & OCR Rx** (`/upload`).
   - Select a patient (e.g., *Sunita Shinde* or *Ramesh Patil*) or upload any prescription image.
   - Click **Analyze & Digitize**.
   - Review the extracted medicines, confidence indicators, Jan Aushadhi generic savings, and click **Approve & Save Prescription**.
4. **Test AI Clinical Triage**:
   - Go to **AI Triage** (`/triage`).
   - Enter patient vitals (e.g., BP `185/110`, SpO2 `94%`).
   - Observe the risk calculation (RED / Emergency) and immediate referral recommendation.
5. **Track Closed-Loop Referrals**:
   - Navigate to **Referrals** (`/referrals`).
   - View active emergency and urgent transfers, update transport status, or generate a new referral.
6. **Check Jan Aushadhi & Pharmacy**:
   - Navigate to **Medicines** (`/pharmacy`) to inspect essential drug stock status and PMBJP Kendra listings.

---

## Contributing

Contributions from healthcare professionals, software engineers, and public health researchers are warmly welcomed!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/CareRouteEnhancement`)
3. Commit your changes (`git commit -m 'Add support for neonatal triage rules'`)
4. Push to the branch (`git push origin feature/CareRouteEnhancement`)
5. Open a Pull Request

---

## License

License has not yet been selected.

---

## Medical Disclaimer

> ⚠️ **IMPORTANT NOTICE**:  
> GramArogya is an experimental software prototype and research artifact developed for educational, demonstration, and technical evaluation purposes (including hackathons). It is **not** a certified medical device and is **not** intended to replace professional medical advice, clinical diagnosis, or emergency healthcare services. All AI and OCR outputs must be validated by licensed medical practitioners before clinical action.
