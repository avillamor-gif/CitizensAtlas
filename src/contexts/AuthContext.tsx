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
    console.log('🚨 [EMERGENCY DEBUG] fetchUserProfile called for:', supabaseUser.email);
    
    // IMMEDIATE HARDCODED ROLES - NO DELAYS, NO CONDITIONS
    if (supabaseUser.email === 'akawar@gmail.com') {
      console.log('🛡️ [IMMEDIATE] Hardcoded super-admin for akawar@gmail.com');
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        role: 'super-admin',
        name: 'akawar',
        full_name: 'akawar',
      });
      return;
    }
    
    if (supabaseUser.email === 'alberto.b.villamor@gmail.com') {
      console.log('🛡️ [IMMEDIATE] Hardcoded admin for alberto.b.villamor@gmail.com');
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        role: 'admin',
        name: 'alberto.b.villamor',
        full_name: 'alberto.b.villamor',
      });
      return;
    }
    
    try {
      console.log('🔍 Fetching profile for user:', supabaseUser.id, supabaseUser.email);
      
      // BACKUP SAFETY NET: Known admin users get hardcoded roles
      if (supabaseUser.email === 'akawar@gmail.com') {
        console.log('🛡️ [IMMEDIATE] Hardcoded super-admin for akawar@gmail.com');
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          role: 'super-admin',
          name: 'akawar',
          full_name: 'akawar',
        });
        return;
      }
      
      if (supabaseUser.email === 'alberto.b.villamor@gmail.com') {
        console.log('🛡️ [IMMEDIATE] Hardcoded admin for alberto.b.villamor@gmail.com');
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          role: 'admin',
          name: 'alberto.b.villamor',
          full_name: 'alberto.b.villamor',
        });
        return;
      }
      
      // For other users, try database lookup
      console.log('🔍 Database lookup for other users...');
      
      // With RLS disabled, we can use simple queries
      let profile = null;
      let error = null;
      
      console.log('🔍 Attempting to fetch profile by ID:', supabaseUser.id);
      const idResult = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle<User>();
      
      if (idResult.data) {
        profile = idResult.data;
        console.log('✅ Profile found by ID:', profile.email, 'Role:', profile.role);
      } else if (idResult.error?.code !== 'PGRST116') {
        // Not a "no rows" error, try email lookup
        console.log('⚠️ Profile not found by ID, trying email lookup...');
        
        const emailResult = await supabase
          .from('profiles')
          .select('*')
          .eq('email', supabaseUser.email!)
          .maybeSingle<User>();
          
        if (emailResult.data) {
          profile = emailResult.data;
          console.log('✅ Profile found by email:', profile.email, 'Role:', profile.role);
        } else {
          error = emailResult.error;
          console.error('❌ Profile not found by email either');
        }
      }

      if (!profile) {
        console.error('❌ No profile found for user:', supabaseUser.email);
        console.warn('⚠️ Profile not found, checking if user already loaded...');
        
        // Don't overwrite existing user data if we already have it loaded
        if (user && user.email === supabaseUser.email && user.role !== 'contributor') {
          console.log('✅ User already loaded with role:', user.role, '- keeping existing data');
          return;
        }
        
        // Use email as fallback if profile doesn't exist
        console.warn('⚠️ Setting fallback contributor role');
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          role: 'contributor',
          name: supabaseUser.email!,
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
