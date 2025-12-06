import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  // ALWAYS return existing instance if available (singleton pattern)
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Use environment variables instead of hardcoded values
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase environment variables:
      NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✓' : '✗'}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✓' : '✗'}`
    )
  }

  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storageKey: 'atlas-auth-token',
      storage: typeof window !== 'undefined' ? {
        getItem: (key: string) => {
          return window.localStorage.getItem(key);
        },
        setItem: (key: string, value: string) => {
          window.localStorage.setItem(key, value);
        },
        removeItem: (key: string) => {
          window.localStorage.removeItem(key);
        },
      } : undefined,
    },
    global: {
      headers: {
        'x-client-info': 'atlas-cms',
      },
    },
  })

  return supabaseInstance
}