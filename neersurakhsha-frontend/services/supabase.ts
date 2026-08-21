import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-supabase-project-id.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key-here';

export const isSupabaseConfigured = () => {
  return (
    supabaseUrl !== 'https://your-supabase-project-id.supabase.co' &&
    supabaseAnonKey !== 'your-supabase-anon-key-here' &&
    Boolean(supabaseUrl && supabaseAnonKey)
  );
};

// Safe Memory Storage fallback if AsyncStorage or window.localStorage is missing or null
const memoryStore = new Map<string, string>();

const SafeExpoStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
      } catch {
        // Ignore and fallback
      }
      return memoryStore.get(key) || null;
    }

    try {
      // Dynamically require to avoid crash if native module is unlinked/null
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      if (AsyncStorage) {
        const val = await AsyncStorage.getItem(key);
        return val;
      }
    } catch {
      // Native module null / unlinked error handled gracefully
    }
    return memoryStore.get(key) || null;
  },

  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
          return;
        }
      } catch {
        // Ignore and fallback
      }
      memoryStore.set(key, value);
      return;
    }

    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      if (AsyncStorage) {
        await AsyncStorage.setItem(key, value);
        return;
      }
    } catch {
      // Native module null / unlinked error handled gracefully
    }
    memoryStore.set(key, value);
  },

  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
          return;
        }
      } catch {
        // Ignore and fallback
      }
      memoryStore.delete(key);
      return;
    }

    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      if (AsyncStorage) {
        await AsyncStorage.removeItem(key);
        return;
      }
    } catch {
      // Native module null / unlinked error handled gracefully
    }
    memoryStore.delete(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SafeExpoStorageAdapter,
    autoRefreshToken: isSupabaseConfigured(),
    persistSession: true,
    detectSessionInUrl: false,
  },
});
