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
      
      // Add timeout to prevent hanging
      const queryPromise = supabase
        .from('profiles')
        .select('*')
        .eq('email', supabaseUser.email!)
        .maybeSingle();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile query timeout')), 5000)
      );
      
      const { data: profile, error } = await Promise.race([
        queryPromise,
        timeoutPromise
      ]) as any;

      console.log('📦 Profile query result:', { profile, error });

      if (error) {
        console.error('❌ Error querying profile:', error);
        setUserWithPersistence({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          role: 'contributor',
          name: supabaseUser.email!,
        });
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
      setUserWithPersistence({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        role: 'contributor',
        name: supabaseUser.email!,
      });
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
          // Only fetch if we don't have cached data or if user ID changed
          if (!cachedUser || cachedUser.id !== session.user.id) {
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
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('✅ Handling auth event:', event);
          setSession(session);
          setSupabaseUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchUserProfile(session.user);
          }
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

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
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
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
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
