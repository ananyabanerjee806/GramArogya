/**
 * Multi-Doctor & Clinic Role-Based Access Control (RBAC) & Multi-Branch SaaS Manager
 */

export type UserRole = 'doctor' | 'receptionist' | 'pharmacist';

export interface UserSessionProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  clinicBranchId: string;
  clinicBranchName: string;
  permissions: {
    canUploadPrescription: boolean;
    canVerifyAndSign: boolean;
    canEditMedications: boolean;
    canRegisterPatient: boolean;
    canDispenseMedications: boolean;
    canViewAnalytics: boolean;
  };
}

export interface ClinicBranch {
  id: string;
  name: string;
  location: string;
  phone: string;
  activeDoctorsCount: number;
}

export const CLINIC_BRANCHES: ClinicBranch[] = [
  {
    id: 'branch-1',
    name: 'Main Downtown Medical Centre',
    location: '104 Healthcare Boulevard, City Centre',
    phone: '+91 (11) 2345-6789',
    activeDoctorsCount: 4,
  },
  {
    id: 'branch-2',
    name: 'Westside Super-Speciality Clinic',
    location: '42 Ring Road, West Enclave',
    phone: '+91 (11) 8765-4321',
    activeDoctorsCount: 3,
  },
  {
    id: 'branch-3',
    name: 'Apollo Care Diagnostic Hub',
    location: '18 Metro Plaza, North Extension',
    phone: '+91 (11) 9876-5432',
    activeDoctorsCount: 2,
  },
];

export const ROLE_PROFILES: Record<UserRole, Omit<UserSessionProfile, 'id' | 'clinicBranchId' | 'clinicBranchName'>> = {
  doctor: {
    name: 'Dr. Robert Smith, MD',
    role: 'doctor',
    roleTitle: 'Chief Medical Consultant',
    permissions: {
      canUploadPrescription: true,
      canVerifyAndSign: true,
      canEditMedications: true,
      canRegisterPatient: true,
      canDispenseMedications: true,
      canViewAnalytics: true,
    },
  },
  receptionist: {
    name: 'Ananya Sharma',
    role: 'receptionist',
    roleTitle: 'Clinic Front Desk & Registration',
    permissions: {
      canUploadPrescription: true,
      canVerifyAndSign: false,
      canEditMedications: false,
      canRegisterPatient: true,
      canDispenseMedications: false,
      canViewAnalytics: false,
    },
  },
  pharmacist: {
    name: 'Vikas Gupta (R.Ph)',
    role: 'pharmacist',
    roleTitle: 'Head Clinical Pharmacist',
    permissions: {
      canUploadPrescription: false,
      canVerifyAndSign: false,
      canEditMedications: false,
      canRegisterPatient: false,
      canDispenseMedications: true,
      canViewAnalytics: true,
    },
  },
};
