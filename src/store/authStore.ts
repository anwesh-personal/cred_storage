import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthState {
  user: any | null;
  profile: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;
  
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  error: null,
  
  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Fetch user profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user?.id)
          .single();
        
        set({ user, session, profile, isLoading: false });
      } else {
        set({ user: null, session: null, profile: null, isLoading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false, error: 'Failed to initialize authentication' });
    }
  },
  
  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Fetch user profile
      if (data.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        set({ 
          user: data.user, 
          session: data.session, 
          profile, 
          isLoading: false 
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to sign in' 
      });
    }
  },
  
  signUp: async (email, password, fullName) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        
        if (profileError) throw profileError;
        
        // Fetch the created profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        set({ 
          user: data.user, 
          session: data.session, 
          profile, 
          isLoading: false 
        });
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to sign up' 
      });
    }
  },
  
  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ 
        user: null, 
        session: null, 
        profile: null, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to sign out' 
      });
    }
  },
  
  updateProfile: async (updates) => {
    try {
      const { profile, user } = get();
      if (!profile || !user) throw new Error('No authenticated user');
      
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Refresh profile
      await get().refreshProfile();
      
    } catch (error: any) {
      console.error('Update profile error:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to update profile' 
      });
    }
  },
  
  refreshProfile: async () => {
    try {
      const { user } = get();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      set({ profile: data, isLoading: false });
    } catch (error: any) {
      console.error('Refresh profile error:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to refresh profile' 
      });
    }
  },
}));
