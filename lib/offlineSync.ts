export interface OfflineSyncItem {
  id: string;
  type: 'REFERRAL_DRAFT' | 'TRIAGE_RECORD' | 'CARE_DEBT_CLOSURE' | 'VITALS_UPDATE';
  payload: any;
  timestamp: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED';
  retryCount: number;
}

const SYNC_QUEUE_KEY = 'gramarogya_offline_queue';

export class OfflineSyncManager {
  
  // Note: In a real app, we'd use idb-keyval or similar.
  // For this prototype, we're simulating with localStorage if available (client-side only)
  
  static async getQueue(): Promise<OfflineSyncItem[]> {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(SYNC_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading offline queue', e);
      return [];
    }
  }

  static async addToQueue(type: OfflineSyncItem['type'], payload: any): Promise<void> {
    if (typeof window === 'undefined') return;
    
    const queue = await this.getQueue();
    const newItem: OfflineSyncItem = {
      id: crypto.randomUUID(),
      type,
      payload,
      timestamp: Date.now(),
      status: 'PENDING',
      retryCount: 0
    };
    
    queue.push(newItem);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    
    // Attempt sync immediately if online
    if (navigator.onLine) {
      this.syncAll();
    }
  }

  static async syncAll(): Promise<void> {
    if (typeof window === 'undefined' || !navigator.onLine) return;
    
    const queue = await this.getQueue();
    if (queue.length === 0) return;

    let updatedQueue = [...queue];

    for (const item of queue) {
      if (item.status === 'PENDING' || item.status === 'FAILED') {
        try {
          // Simulate API call
          await this.processItem(item);
          
          // Remove from queue if successful
          updatedQueue = updatedQueue.filter(q => q.id !== item.id);
        } catch (e) {
          // Update retry count
          const index = updatedQueue.findIndex(q => q.id === item.id);
          if (index !== -1) {
            updatedQueue[index].retryCount += 1;
            updatedQueue[index].status = 'FAILED';
          }
        }
      }
    }

    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updatedQueue));
  }

  private static async processItem(item: OfflineSyncItem): Promise<boolean> {
    // Simulated API endpoints for the prototype
    console.log(`[OfflineSync] Syncing ${item.type}...`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[OfflineSync] Successfully synced ${item.id}`);
        resolve(true);
      }, 800);
    });
  }
}

// Generate Care Passport payload
export function generateCarePassportQR(patientId: string, abhaId: string, name: string, riskCategory?: string): string {
  const minimalPayload = {
    pid: patientId,
    abha: abhaId,
    n: name,
    r: riskCategory || 'NORMAL',
    t: Date.now()
  };
  
  // In a real scenario, this would be encrypted and signed
  // Here we just base64 encode it for the QR code representation
  return btoa(JSON.stringify(minimalPayload));
}
