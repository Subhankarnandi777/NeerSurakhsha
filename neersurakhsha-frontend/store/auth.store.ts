import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Session, User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  village_name?: string;
  created_at?: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
  
  signIn: (identifier: string, pinOrPassword: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role: string;
    villageName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
}

// Helper to sanitize login identifier (support phone number or email)
const formatEmail = (identifier: string): string => {
  const trimmed = identifier.trim();
  if (trimmed.includes('@')) {
    return trimmed;
  }
  // Clean phone number (digits only)
  const cleanPhone = trimmed.replace(/[^0-9]/g, '');
  if (cleanPhone.length >= 10) {
    return `${cleanPhone}@neersurakhsha.org`;
  }
  return trimmed;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: false,
  error: null,
  isConfigured: isSupabaseConfigured(),

  checkSession: async () => {
    if (!isSupabaseConfigured()) {
      set({ isConfigured: false });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.warn('Supabase session fetch error:', sessionError.message);
        set({ user: null, session: null, profile: null, isLoading: false });
        return;
      }

      if (session?.user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({
          session,
          user: session.user,
          profile: profile || {
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            phone: session.user.user_metadata?.phone || '',
            role: session.user.user_metadata?.role || 'ASHA Worker',
            village_name: session.user.user_metadata?.village_name || 'Brahmapur Char',
          },
          isLoading: false,
        });
      } else {
        set({ user: null, session: null, profile: null, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || 'Session check failed', isLoading: false });
    }
  },

  signIn: async (identifier, pinOrPassword) => {
    set({ isLoading: true, error: null });

    const formattedEmail = formatEmail(identifier);

    if (!isSupabaseConfigured()) {
      // Demo fallback when Supabase keys are not set up yet
      await new Promise(res => setTimeout(res, 800));
      const demoProfile: UserProfile = {
        id: 'demo-user-123',
        full_name: 'Demo Worker',
        email: formattedEmail,
        phone: identifier.includes('@') ? '+91 98765 43210' : identifier,
        role: 'ASHA Worker',
        village_name: 'Brahmapur Char',
      };
      set({
        user: { id: 'demo-user-123', email: formattedEmail } as any,
        profile: demoProfile,
        isLoading: false,
        error: null,
      });
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password: pinOrPassword,
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        // Fetch user profile from public.profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        set({
          session: data.session,
          user: data.user,
          profile: profile || {
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || 'User',
            email: data.user.email || '',
            phone: data.user.user_metadata?.phone || '',
            role: data.user.user_metadata?.role || 'ASHA Worker',
            village_name: data.user.user_metadata?.village_name || 'Brahmapur Char',
          },
          isLoading: false,
          error: null,
        });

        return { success: true };
      }

      set({ isLoading: false });
      return { success: false, error: 'Login failed: No session created.' };
    } catch (err: any) {
      const msg = err.message || 'An unexpected authentication error occurred.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  signUp: async ({ email, password, fullName, phone, role, villageName }) => {
    set({ isLoading: true, error: null });

    const formattedEmail = formatEmail(email);
    const selectedRole = role || 'ASHA Worker';
    const selectedVillage = villageName || 'Brahmapur Char';

    if (!isSupabaseConfigured()) {
      // Demo fallback when Supabase is unconfigured
      await new Promise(res => setTimeout(res, 800));
      const demoProfile: UserProfile = {
        id: 'demo-new-user',
        full_name: fullName,
        email: formattedEmail,
        phone,
        role: selectedRole,
        village_name: selectedVillage,
      };
      set({
        user: { id: 'demo-new-user', email: formattedEmail } as any,
        profile: demoProfile,
        isLoading: false,
        error: null,
      });
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formattedEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            role: selectedRole,
            village_name: selectedVillage,
          },
        },
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Try creating profile manually if trigger didn't run
        const profileData: UserProfile = {
          id: data.user.id,
          full_name: fullName,
          email: formattedEmail,
          phone,
          role: selectedRole,
          village_name: selectedVillage,
        };

        await supabase.from('profiles').upsert(profileData);

        set({
          user: data.user,
          session: data.session,
          profile: profileData,
          isLoading: false,
          error: null,
        });

        return { success: true };
      }

      set({ isLoading: false });
      return { success: false, error: 'Registration failed.' };
    } catch (err: any) {
      const msg = err.message || 'Registration failed.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    set({ user: null, session: null, profile: null, isLoading: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
