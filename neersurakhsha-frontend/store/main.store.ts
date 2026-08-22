import { create } from 'zustand';
import { Platform } from 'react-native';
import { WaterSource } from '../types/source';
import { HealthCase } from '../types/health';
import { supabase } from '../lib/supabase';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("FATAL ERROR: EXPO_PUBLIC_API_BASE_URL is not set in environment variables!");
  // In a real app we might show an alert or splash screen error here.
}

interface AppState {
  userRole: string;
  userName: string;
  userPhone: string;
  villageName: string;
  sources: WaterSource[];
  healthCases: HealthCase[];
  pendingSyncCount: number;
  setUserRole: (role: string) => void;
  setUserName: (name: string) => void;
  setUserPhone: (phone: string) => void;
  addHealthCase: (healthCase: HealthCase) => void;
  fetchSources: () => Promise<void>;
  syncData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  // PROTOTYPE SEED DATA: Hardcoded default user for demonstration purposes
  // In production, these should be initialized empty and populated via login response.
  userRole: 'ASHA Worker',
  userName: 'Anjali Sharma',
  userPhone: '+91 98765 43210',
  villageName: 'Brahmapur Char',
  sources: [],
  healthCases: [],
  pendingSyncCount: 0,
  setUserRole: (role) => set({ userRole: role }),
  setUserName: (name) => set({ userName: name }),
  setUserPhone: (phone) => set({ userPhone: phone }),
  addHealthCase: (newCase) => set((state) => {
    const newCaseUnsynced = { ...newCase, synced: false };
    return {
      healthCases: [...state.healthCases, newCaseUnsynced],
      pendingSyncCount: state.pendingSyncCount + 1
    };
  }),
  fetchSources: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: any = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`${API_BASE_URL}/sources/`, { headers });
      if (!response.ok) {
        console.error('Failed to fetch sources:', response.statusText);
        // Fallback to empty array if error
        set({ sources: [] });
        return;
      }
      const data = await response.json();
      // Ensure data is an array
      if (Array.isArray(data)) {
        set({ sources: data });
      } else {
        console.error('Invalid sources data format:', data);
        set({ sources: [] });
      }
    } catch (error) {
      console.error('Failed to fetch sources:', error);
      set({ sources: [] });
    }
  },
  syncData: async () => {
    try {
      // Get all unsynced health cases
      const unsyncedCases = useAppStore.getState().healthCases.filter(c => !c.synced);
      if (unsyncedCases.length === 0) return;

      const payload = {
        healthCases: unsyncedCases
      };

      const { data: { session } } = await supabase.auth.getSession();
      const headers: any = { 
        'Content-Type': 'application/json'
      };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`${API_BASE_URL}/sync/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Sync failed');
      const data = await response.json();

      set((state) => ({
        // Mark all sent cases as synced
        healthCases: state.healthCases.map(c => 
          unsyncedCases.find(uc => uc.id === c.id) ? { ...c, synced: true } : c
        ),
        // Update sources from backend
        sources: data.updatedSources,
        pendingSyncCount: 0
      }));
    } catch (error) {
      console.error('Failed to sync data:', error);
    }
  }
}));
