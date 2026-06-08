'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get supabase client (lazy initialization)
  const supabase = createClient();
  
  // Track if we're currently fetching a profile to prevent race conditions
  const fetchingProfile = useRef(false);
  
  // Helper to save user to localStorage
  const saveUserToStorage = (userData: User | null) => {
    if (typeof window === 'undefined') return;
    
    if (userData) {
      localStorage.setItem('atlas-user-profile', JSON.stringify(userData));
      console.log('💾 Saved user profile to localStorage');
    } else {
      localStorage.removeItem('atlas-user-profile');
      console.log('🗑️  Removed user profile from localStorage');
    }
  };
  
  // Helper to load user from localStorage
  const loadUserFromStorage = (): User | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem('atlas-user-profile');
      if (stored) {
        const userData = JSON.parse(stored);
        console.log('📥 Loaded user profile from localStorage:', userData.role);
        return userData;
      }
    } catch (error) {
      console.error('❌ Error loading user from localStorage:', error);
    }
    return null;
  };
  
  // Wrapped setUser to also persist to localStorage
  const setUserWithPersistence = (userData: User | null) => {
    setUser(userData);
    saveUserToStorage(userData);
  };

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    // Prevent multiple simultaneous fetches for the same user
    if (fetchingProfile.current) {
      console.log('⏸️  Profile fetch already in progress, skipping...');
      return;
    }
    
    fetchingProfile.current = true;
    
    try {
      console.log('🔍 Fetching profile for user:', supabaseUser.id, supabaseUser.email);
      
      // Increased timeout for slower connections (was 10s, now 20s)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);
      
      let profile: any = null;
      let error: any = null;
      
      try {
        // Query by ID instead of email - it's the primary key and faster
        const result = await supabase
          .from('profiles')
          .select('id, email, role, full_name, avatar_url')
          .eq('id', supabaseUser.id)
          .single();
        
        clearTimeout(timeoutId);
        profile = result.data;
        error = result.error;
      } catch (err) {
        clearTimeout(timeoutId);
        console.error('❌ Profile query exception:', err);
        error = err;
      }

      console.log('📦 Profile query result:', { profile, error });

      if (error) {
        console.error('❌ Error querying profile:', error);
        // Don't overwrite cached profile on error - keep existing data
        const cachedUser = loadUserFromStorage();
        if (cachedUser && cachedUser.id === supabaseUser.id) {
          console.log('⚠️ Query failed, keeping cached profile:', cachedUser.role);
          setUser(cachedUser); // Update state without overwriting localStorage
        } else {
          console.log('⚠️ Query failed and no cache, using default contributor role');
          setUserWithPersistence({
            id: supabaseUser.id,
            email: supabaseUser.email!,
            role: 'contributor',
            name: supabaseUser.email!,
          });
        }
        return;
      }

      if (profile) {
        console.log('✅ Profile found:', (profile as any).role);
        const userData = {
          id: (profile as any).id,
          email: (profile as any).email,
          role: (profile as any).role,
          name: (profile as any).full_name || (profile as any).email,
          full_name: (profile as any).full_name,
          avatar_url: (profile as any).avatar_url || '',
        };
        console.log('👤 Setting user data:', userData);
        setUserWithPersistence(userData);
      } else {
        console.log('⚠️ No profile found in database, using default contributor role');
        setUserWithPersistence({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          role: 'contributor',
          name: supabaseUser.email!,
        });
      }
    } catch (error) {
      console.error('❌ Exception fetching profile:', error);
      // Don't overwrite cached profile on exception - keep existing data
      const cachedUser = loadUserFromStorage();
      if (cachedUser && cachedUser.id === supabaseUser.id) {
        console.log('⚠️ Query exception, keeping cached profile:', cachedUser.role);
        setUser(cachedUser); // Update state without overwriting localStorage
      } else {
        console.log('⚠️ Query exception and no cache, using default contributor role');
        setUserWithPersistence({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          role: 'contributor',
          name: supabaseUser.email!,
        });
      }
    } finally {
      fetchingProfile.current = false;
    }
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;
    let isInitializing = true;

    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing auth...');
        
        // Try to load user from localStorage first for instant state restoration
        const cachedUser = loadUserFromStorage();
        if (cachedUser) {
          console.log('⚡ Restoring user from cache:', cachedUser.role);
          setUser(cachedUser);
        }
        
        // Then check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('📦 Session found:', session ? 'YES' : 'NO');
        
        setSession(session);
        setSupabaseUser(session?.user ?? null);
        
        if (session?.user) {
          // Force fetch if no cached data, user ID changed, or avatar_url is missing
          const needsFetch = !cachedUser || 
                            cachedUser.id !== session.user.id || 
                            !cachedUser.avatar_url;
          
          if (needsFetch) {
            console.log('🔄 Fetching fresh profile (missing data or avatar)');
            await fetchUserProfile(session.user);
          }
        } else {
          setUserWithPersistence(null);
        }
        
        setLoading(false);
        isInitializing = false;
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
          isInitializing = false;
        }
      }
    };

    // Subscribe to auth changes
    const setupAuthListener = () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        
        console.log('🔄 Auth state change:', event, session ? 'Session exists' : 'No session');
        
        // Only handle specific events that require action
        if (event === 'SIGNED_IN') {
          console.log('✅ Handling auth event: SIGNED_IN');
          setSession(session);
          setSupabaseUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchUserProfile(session.user);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          // On token refresh, just update session without re-fetching profile
          console.log('🔄 Token refreshed, updating session only (keeping cached profile)');
          setSession(session);
          setSupabaseUser(session?.user ?? null);
          // Don't fetch profile again - use cached data
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out');
          setSession(null);
          setSupabaseUser(null);
          setUserWithPersistence(null);
        } else {
          console.log('⏭️  Ignoring event:', event);
        }
      });
      
      authSubscription = subscription;
    };

    setupAuthListener();
    initializeAuth();

    // Listen for profile updates from AccountProfile component
    const handleProfileUpdate = (event: CustomEvent) => {
      if (user) {
        const updatedUser = {
          ...user,
          full_name: event.detail.full_name,
          avatar_url: event.detail.avatar_url,
          name: event.detail.full_name || user.name,
        };
        setUser(updatedUser);
        console.log('✅ AuthContext: Profile updated from event', updatedUser);
      }
    };

    window.addEventListener('profile-updated', handleProfileUpdate as EventListener);

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
      window.removeEventListener('profile-updated', handleProfileUpdate as EventListener);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      
      // Clear Supabase auth session first
      await supabase.auth.signOut();
      
      // Clear all auth-related data from localStorage
      localStorage.removeItem('atlas-auth-token');
      localStorage.removeItem('atlas-user-profile');
      
      // Clear state
      setUserWithPersistence(null);
      setSupabaseUser(null);
      setSession(null);
      
      console.log('✅ Signed out successfully - all data cleared');
      
      // Force redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Sign out error:', error);
      // Even if there's an error, try to clear local state and redirect
      localStorage.removeItem('atlas-auth-token');
      localStorage.removeItem('atlas-user-profile');
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
      window.location.href = '/';
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
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
