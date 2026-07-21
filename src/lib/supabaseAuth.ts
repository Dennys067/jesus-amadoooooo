import { supabase, isSupabaseConfigured } from './supabase';
import { GoogleUser } from '../types';

let cachedAccessToken: string | null = null;

// Listen to Auth changes and load session
export const initAuth = (
  onAuthSuccess?: (user: GoogleUser, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (!supabase) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }

  // 2. Real Supabase Auth listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session && session.user) {
      const googleUser: GoogleUser = {
        uid: session.user.id,
        email: session.user.email || null,
        displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Usuário',
        photoURL: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
      };

      const token = session.provider_token || session.access_token || '';
      if (token) {
        cachedAccessToken = token;
        sessionStorage.setItem('ap_temp_at', token);
      }
      if (onAuthSuccess) {
        onAuthSuccess(googleUser, token);
      }
    } else {
      if (!sessionStorage.getItem('ap_mock_user')) {
        cachedAccessToken = null;
        sessionStorage.removeItem('ap_temp_at');
        if (onAuthFailure) onAuthFailure();
      }
    }
  });

  return () => {
    subscription.unsubscribe();
  };
};

// Sign in with Google (via Supabase)
export const googleSignIn = async (): Promise<{ user: GoogleUser; accessToken: string } | null> => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase não configurado. Configure as chaves no arquivo .env");
    return null;
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/drive',
      redirectTo: window.location.origin,
      queryParams: {
        prompt: 'select_account',
      },
    },
  });

  if (error) {
    console.error('Supabase Google Sign-In error:', error);
    throw error;
  }

  return null; // Page will redirect
};

// Get current Google access token
export const getAccessToken = async (): Promise<string | null> => {
  if (!cachedAccessToken) {
    cachedAccessToken = sessionStorage.getItem('ap_temp_at');
  }
  return cachedAccessToken;
};

// Sign out from session
export const logout = async () => {
  cachedAccessToken = null;
  sessionStorage.removeItem('ap_temp_at');
  sessionStorage.removeItem('ap_mock_user');
  if (supabase) {
    await supabase.auth.signOut();
  }
};

// Check if Supabase (formerly Firebase) auth is configured
export const checkSupabaseEnabled = (): boolean => {
  return isSupabaseConfigured;
};

// Alias for backwards compatibility with Firebase import statements
export const checkFirebaseEnabled = checkSupabaseEnabled;