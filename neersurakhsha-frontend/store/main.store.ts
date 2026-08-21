import { create } from 'zustand';
import { WaterSource } from '../types/source';
import { HealthCase } from '../types/health';

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
  syncData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  userRole: 'ASHA Worker',
  userName: 'Anjali Sharma',
  userPhone: '+91 98765 43210',
  villageName: 'Brahmapur Char',
  sources: [
    {
      id: 'HP-007',
      name: 'Primary Handpump 007',
      type: 'Handpump',
      status: 'HIGH_RISK',
      distance: 120,
      lat: 26.2,
      lng: 91.7,
      householdsUsing: 45,
      lastTestResult: 'Positive',
      groundwaterTrend: 'Rising',
      healthCasesCount: 8,
      riskExplanation: [
        'H₂S test positive',
        '8 diarrhoea cases reported',
        'Groundwater level rising rapidly'
      ],
      recommendedAlternativeId: 'TW-001'
    },
    {
      id: 'TW-001',
      name: 'School Tubewell',
      type: 'Tubewell',
      status: 'SAFE',
      distance: 450,
      lat: 26.205,
      lng: 91.708,
      householdsUsing: 120,
      lastTestResult: 'Negative',
      groundwaterTrend: 'Stable',
      healthCasesCount: 0,
      riskExplanation: [],
    }
  ],
  healthCases: [],
  pendingSyncCount: 6,
  setUserRole: (role) => set({ userRole: role }),
  setUserName: (name) => set({ userName: name }),
  setUserPhone: (phone) => set({ userPhone: phone }),
  addHealthCase: (newCase) => set((state) => ({ 
    healthCases: [...state.healthCases, newCase],
    pendingSyncCount: state.pendingSyncCount + 1
  })),
  syncData: async () => {
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 2000));
    set({ pendingSyncCount: 0 });
  }
}));
