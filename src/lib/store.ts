// Basic in-memory store for checking flow
// In a real app, this would be a database

export type ApplicationStatus = 'Submitted' | 'Reviewing' | 'Determine' | 'Paid';

export interface Application {
  id: string;
  firstName: string;
  lastName: string;
  submittedAt: string;
  status: string; // Display string like 'Pending Review'
  step: number; // 0: Submitted, 1: Reviewing, 2: Determine, 3: Paid
  progress: number;
  estimatedCompletion: string;
  week: string;
  notifications: any[];
  workLog: any[];
}

// Global instance to persist in dev server memory (warn: resets on restart)
// We attach it to globalThis to survive HMR in dev mode
const globalStore = globalThis as unknown as { store: Store };

// Adapter class to handle async DB operations vs sync memory operations
// For this MVP, we will keep the synchronous API for the Store class to avoid refactoring the whole app
// but in the background we would sync to Firestore if available.

class Store {
  private applications: Record<string, Application> = {};

  constructor() {
    // Seed with the default mock user
    this.applications['MN-2024-555'] = {
      id: 'MN-2024-555',
      firstName: 'John',
      lastName: 'Doe',
      submittedAt: new Date().toISOString(),
      status: 'Pending Review',
      step: 1, 
      progress: 33,
      estimatedCompletion: '5-7 business days',
      week: 'Dec 15 - Dec 21',
      notifications: [
        { id: 1, message: 'Application Received', date: 'Dec 22, 2:30 PM', type: 'success' },
        { id: 2, message: 'Handbook Available', date: 'Dec 22, 2:31 PM', type: 'info' }
      ],
      workLog: [] 
    };
  }

  get(id: string) {
    return this.applications[id];
  }

  getAll() {
    return Object.values(this.applications);
  }

  add(app: Application) {
    this.applications[app.id] = app;
    // TODO: if (firebaseDb) setDoc(doc(firebaseDb, "applications", app.id), app);
  }

  update(id: string, updates: Partial<Application>) {
    if (this.applications[id]) {
      this.applications[id] = { ...this.applications[id], ...updates };
      // TODO: if (firebaseDb) updateDoc(doc(firebaseDb, "applications", id), updates);
      return this.applications[id];
    }
    return null;
  }
}

if (!globalStore.store) {
  globalStore.store = new Store();
}

export const db = globalStore.store;
