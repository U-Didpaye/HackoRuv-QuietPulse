import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

// Environment variables configured according to Vite and project guidelines
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
const supabasePublishableKey = (
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)
)?.trim() || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  !supabaseUrl.includes('your-project') &&
  !supabasePublishableKey.includes('your-supabase')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'quietpulse_auth_token',
      },
    })
  : null;

/**
 * Clean, type-safe authentication helpers integrated with QuietPulse
 */
export async function signInWithEmail(email: string, password: string): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
  if (!supabase) {
    return { user: null, session: null, error: new Error('Supabase client is not configured.') };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return {
    user: data.user,
    session: data.session,
    error: error ? new Error(error.message) : null,
  };
}

export async function signUpWithEmail(email: string, password: string): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
  if (!supabase) {
    return { user: null, session: null, error: new Error('Supabase client is not configured.') };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
    },
  });
  return {
    user: data.user,
    session: data.session,
    error: error ? new Error(error.message) : null,
  };
}

export async function signOutUser(): Promise<{ error: Error | null }> {
  if (!supabase) {
    return { error: null };
  }
  const { error } = await supabase.auth.signOut();
  return { error: error ? new Error(error.message) : null };
}

export async function getCurrentSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function signInWithGoogle(): Promise<{ error: Error | null; url?: string }> {
  if (!supabase) {
    return { error: new Error('Supabase is not configured.') };
  }

  // Detect whether running inside the QuietPulse Android native shell
  const isAndroid = typeof window !== 'undefined' && Boolean((window as any).QuietPulseAndroid?.isAndroidApp());

  if (isAndroid) {
    try {
      // In Android: Use skipBrowserRedirect so Supabase returns the OAuth URL,
      // and redirect to quietpulse://auth/callback so the native intent filter catches the response.
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'quietpulse://auth/callback',
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      if (data?.url) {
        const bridge = (window as any).QuietPulseAndroid;
        if (bridge && typeof bridge.openExternalOAuth === 'function') {
          bridge.openExternalOAuth(data.url);
        } else {
          window.location.href = data.url;
        }
        return { error: null, url: data.url };
      }
    } catch (err: any) {
      return { error: new Error(err?.message || 'Failed to initiate Google authentication on Android.') };
    }
  }

  // Web application OAuth redirect (100% preserved)
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
    },
  });
  return { error: error ? new Error(error.message) : null };
}

/**
 * Handles incoming OAuth callback URIs delivered from Android deep links or browser redirects.
 * Supports both PKCE authorization codes (?code=...) and implicit tokens (#access_token=...).
 */
export async function handleOAuthCallbackUrl(callbackUrl: string): Promise<{ success: boolean; email?: string; error?: Error }> {
  if (!supabase) {
    return { success: false, error: new Error('Supabase is not configured.') };
  }

  try {
    let hash = '';
    let search = '';

    if (callbackUrl.includes('#')) {
      hash = callbackUrl.substring(callbackUrl.indexOf('#') + 1);
    }
    if (callbackUrl.includes('?')) {
      const qIndex = callbackUrl.indexOf('?');
      const endIndex = callbackUrl.includes('#') ? callbackUrl.indexOf('#') : callbackUrl.length;
      search = callbackUrl.substring(qIndex + 1, endIndex);
    }

    const hashParams = new URLSearchParams(hash);
    const searchParams = new URLSearchParams(search);

    const errorDesc = searchParams.get('error_description') || hashParams.get('error_description');
    if (errorDesc) {
      return { success: false, error: new Error(decodeURIComponent(errorDesc)) };
    }

    const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');

    if (accessToken && refreshToken) {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        return { success: false, error: new Error(error.message) };
      }

      const email = data.session?.user?.email;
      if (email) {
        localStorage.setItem('quietpulse_user', email);
        return { success: true, email };
      }
      return { success: true };
    }

    const code = searchParams.get('code') || hashParams.get('code');
    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        return { success: false, error: new Error(error.message) };
      }
      const email = data.session?.user?.email;
      if (email) {
        localStorage.setItem('quietpulse_user', email);
        return { success: true, email };
      }
      return { success: true };
    }

    // Fallback: Verify if a session was registered in the client
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user?.email) {
      localStorage.setItem('quietpulse_user', sessionData.session.user.email);
      return { success: true, email: sessionData.session.user.email };
    }

    return { success: false, error: new Error('Authentication token or code not found in callback.') };
  } catch (err: any) {
    return { success: false, error: new Error(err?.message || 'Error processing authentication callback.') };
  }
}

/**
 * Synchronize user settings/preferences (Context mode, personalized settings, rules)
 * to Supabase if authenticated, keeping notification contents sovereign and local.
 */
export async function syncPreferencesToCloud(
  userId: string,
  preferences: {
    contextMode?: string;
    personalizedSettings?: any;
    rules?: any;
  }
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('user_preferences').upsert({
      user_id: userId,
      ...preferences,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    return !error;
  } catch (e) {
    console.warn('Cloud preferences sync skipped:', e);
    return false;
  }
}

export async function fetchPreferencesFromCloud(userId: string): Promise<any | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error || !data) return null;
    return data;
  } catch (e) {
    console.warn('Cloud preferences fetch skipped:', e);
    return null;
  }
}
