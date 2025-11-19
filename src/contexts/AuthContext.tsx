'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { User } from '@/types/types';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create client once outside component to avoid recreating on every render
const supabase = createClient();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('🔍 [DETAILED] Fetching profile for user:', {
        id: supabaseUser.id,
        email: supabaseUser.email,
        timestamp: new Date().toISOString()
      });
      
      // With RLS disabled, we can use simple queries
      let profile = null;
      let error = null;
      
      console.log('🔍 [STEP 1] Attempting to fetch profile by ID:', supabaseUser.id);
      const idResult = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle<User>();
      
      console.log('🔍 [STEP 1 RESULT]', {
        hasData: !!idResult.data,
        error: idResult.error,
        data: idResult.data ? { email: idResult.data.email, role: idResult.data.role } : null
      });
      
      if (idResult.data) {
        profile = idResult.data;
        console.log('✅ [SUCCESS] Profile found by ID:', profile.email, 'Role:', profile.role);
      } else if (idResult.error?.code !== 'PGRST116') {
        // Not a "no rows" error, try email lookup
        console.log('⚠️ [STEP 2] Profile not found by ID, trying email lookup for:', supabaseUser.email);
        
        const emailResult = await supabase
          .from('profiles')
          .select('*')
          .eq('email', supabaseUser.email!)
          .maybeSingle<User>();
          
        console.log('🔍 [STEP 2 RESULT]', {
          hasData: !!emailResult.data,
          error: emailResult.error,
          data: emailResult.data ? { email: emailResult.data.email, role: emailResult.data.role } : null
        });
          
        if (emailResult.data) {
          profile = emailResult.data;
          console.log('✅ [SUCCESS] Profile found by email:', profile.email, 'Role:', profile.role);
        } else {
          error = emailResult.error;
          console.error('❌ [FAILED] Profile not found by email either:', error);
        }
      }

      if (!profile) {
        console.error('❌ [CRITICAL] No profile found for user:', supabaseUser.email);
        console.error('❌ [CRITICAL] This should not happen with RLS disabled and existing profiles');
        
        // Let's try a direct query to see all profiles
        console.log('🔍 [DEBUG] Attempting to fetch ALL profiles to debug...');
        const allProfilesResult = await supabase
          .from('profiles')
          .select('id, email, role')
          .limit(10);
          
        console.log('🔍 [DEBUG] All profiles result:', {
          count: allProfilesResult.data?.length || 0,
          profiles: allProfilesResult.data?.map((p: any) => ({ email: p.email, role: p.role })) || [],
          error: allProfilesResult.error
        });
        
        // Try to recover from localStorage backup
        const backupProfile = localStorage.getItem('atlas-user-profile');
        if (backupProfile) {
          try {
            const parsedProfile = JSON.parse(backupProfile);
            if (parsedProfile.email === supabaseUser.email) {
              console.log('🔄 Recovering profile from localStorage backup:', parsedProfile.role);
              setUser(parsedProfile);
              return;
            }
          } catch (e) {
            console.warn('⚠️ Failed to parse backup profile');
          }
        }
        
        console.warn('⚠️ Profile not found, checking if user already loaded...');
        
        // Don't overwrite existing user data if we already have it loaded
        if (user && user.email === supabaseUser.email && user.role !== 'contributor') {
          console.log('✅ User already loaded with role:', user.role, '- keeping existing data');
          return;
        }
        
        // SAFETY NET: Hardcoded admin roles for known emails (since profiles exist but lookup failed)
        let fallbackRole: 'super-admin' | 'admin' | 'contributor' = 'contributor';
        let fallbackName = supabaseUser.email!;
        
        if (supabaseUser.email === 'akawar@gmail.com') {
          fallbackRole = 'super-admin';
          fallbackName = 'akawar';
          console.log('🛡️ [SAFETY NET] Using hardcoded super-admin role for akawar@gmail.com');
        } else if (supabaseUser.email === 'alberto.b.villamor@gmail.com') {
          fallbackRole = 'admin';
          fallbackName = 'alberto.b.villamor';
          console.log('🛡️ [SAFETY NET] Using hardcoded admin role for alberto.b.villamor@gmail.com');
        } else if (supabaseUser.email === 'albrecht@no-burn.org') {
          fallbackRole = 'super-admin';
          fallbackName = 'Super Admin';
          console.log('🛡️ [SAFETY NET] Using hardcoded super-admin role for albrecht@no-burn.org');
        }
        
        // Use fallback role
        console.warn('⚠️ Setting fallback role:', fallbackRole);
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          role: fallbackRole,
          name: fallbackName,
        });
        return;
      }

      if (profile) {
        console.log('✅ Profile loaded successfully:', {
          email: profile.email,
          role: profile.role,
          name: profile.full_name
        });
        
        // Store the profile data in localStorage as backup
        const userProfile = {
          id: profile.id,
          email: profile.email,
          role: profile.role,
          name: profile.full_name,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url || supabaseUser.user_metadata?.avatar_url,
        };
        
        localStorage.setItem('atlas-user-profile', JSON.stringify(userProfile));
        console.log('💾 Profile backed up to localStorage:', profile.role);
        console.log('🔒 ADMIN ROLE LOADED - should persist now:', profile.role);
        
        setUser(userProfile);
      } else {
        console.warn('⚠️ No profile data returned, using fallback');
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          role: 'contributor',
          name: supabaseUser.email!,
        });
      }
    } catch (error) {
      console.error('❌ Exception fetching user profile:', error);
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        role: 'contributor',
        name: supabaseUser.email!,
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        // Increase timeout and add better logging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            console.error('⏱️ Auth initialization timeout after 15s');
            reject(new Error('Auth initialization timeout'))
          }, 15000)
        })
        
        console.log('🔄 Initializing auth session...');
        const sessionPromise = supabase.auth.getSession()
        
        const { data: { session } } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as { data: { session: Session | null } }
        
        console.log('✅ Auth session initialized:', session ? 'Logged in' : 'Not logged in');
        
        if (!mounted) return;
        
        setSession(session);
        setSupabaseUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        // Continue anyway - user can still try to login
      } finally {
        if (mounted) {
          console.log('✅ Auth initialization complete, setting loading = false');
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      console.log('🔄 Auth state changed:', _event, 'Session:', session ? 'exists' : 'null');
      
      // Prevent unnecessary profile fetches for token refresh events
      if (_event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed - keeping existing user data');
        setSession(session);
        setSupabaseUser(session?.user ?? null);
        return;
      }
      
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 Fetching profile for auth state change...');
        await fetchUserProfile(session.user);
      } else {
        console.log('👤 No user in session - clearing user data');
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting login with REST API...');
      console.log('AuthContext: Email:', email);
      
      const startTime = Date.now();
      
      // Use direct REST API call instead of problematic SDK
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        },
        body: JSON.stringify({
          email,
          password,
        })
      });
      
      const duration = Date.now() - startTime;
      console.log(`AuthContext: Login completed in ${duration}ms`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('AuthContext: Login error:', errorData);
        return { error: new Error(errorData.message || 'Login failed') };
      }
      
      const data = await response.json();
      
      console.log('AuthContext: Login successful', {
        hasUser: !!data?.user,
        hasAccessToken: !!data?.access_token,
        userId: data?.user?.id
      });
      
      // Store the session data for use by our localStorage auth pattern
      if (data.access_token && data.refresh_token) {
        const sessionData = {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: data.expires_at,
          expires_in: data.expires_in,
          token_type: data.token_type,
          user: data.user
        };
        
        localStorage.setItem('atlas-auth-token', JSON.stringify(sessionData));
        console.log('✅ [AuthContext] Session stored in localStorage for CRUD operations');
        
        // Also save to Supabase client storage for compatibility
        if (data.user) {
          setSupabaseUser(data.user);
          setSession(sessionData as any);
          
          // Fetch profile in background - don't block login completion
          fetchUserProfile(data.user).catch(error => {
            console.error('Profile fetch failed but login still successful:', error);
          });
        }
      }
      
      console.log('✅ [AuthContext] Login completed successfully');
      return { error: null };
    } catch (error) {
      console.error('AuthContext: Login exception:', error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthContext: Signing out...');
      
      // Clear local state immediately
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
      
      // Clear any lingering session data
      if (typeof window !== 'undefined') {
        // Clear our custom auth token first
        localStorage.removeItem('atlas-auth-token');
        console.log('AuthContext: Cleared atlas-auth-token');
        
        // Clear localStorage keys that Supabase might use
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log('AuthContext: Cleared', keysToRemove.length, 'localStorage keys');
      }
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('AuthContext: Sign out error:', error);
        // Continue anyway - local state is cleared
      }
      
      console.log('AuthContext: Sign out complete');
    } catch (error) {
      console.error('AuthContext: Sign out exception:', error);
      // Still clear state even if there's an error
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Get the current production URL dynamically
      const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
      let baseUrl;
      
      if (isProduction) {
        // In production, construct the URL from the current location
        baseUrl = `${window.location.protocol}//${window.location.host}`;
      } else {
        // In development, use localhost
        baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      }
      
      const redirectTo = `${baseUrl}/auth/reset-password`;
      
      console.log('🔄 Sending password reset email to:', email);
      console.log('🌍 Environment:', isProduction ? 'Production' : 'Development');
      console.log('📧 Redirect URL:', redirectTo);
      console.log('🔧 NEXT_PUBLIC_APP_URL env var:', process.env.NEXT_PUBLIC_APP_URL);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });
      
      if (error) {
        console.error('❌ Reset password error:', error);
      } else {
        console.log('✅ Reset password email sent successfully');
      }
      
      return { error };
    } catch (error) {
      console.error('❌ Reset password exception:', error);
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
