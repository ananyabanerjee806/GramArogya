export interface ABDMService {
  linkAbhaId(patientId: string, abhaId: string): Promise<boolean>;
  fetchPatientHealthRecords(abhaId: string): Promise<any[]>;
  syncCareEventToAbdm(abhaId: string, eventDetails: any): Promise<boolean>;
}

// Mock Implementation for prototype
export class MockABDMService implements ABDMService {
  async linkAbhaId(patientId: string, abhaId: string): Promise<boolean> {
    console.log(`[ABDM Sandbox] Linked ABHA ${abhaId} to patient ${patientId}`);
    return true;
  }
  
  async fetchPatientHealthRecords(abhaId: string): Promise<any[]> {
    console.log(`[ABDM Sandbox] Fetched records for ABHA ${abhaId}`);
    return [];
  }
  
  async syncCareEventToAbdm(abhaId: string, eventDetails: any): Promise<boolean> {
    console.log(`[ABDM Sandbox] Synced event for ABHA ${abhaId}`, eventDetails);
    return true;
  }
}

export const abdmService = new MockABDMService();
