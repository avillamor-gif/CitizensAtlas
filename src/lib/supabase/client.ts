import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

// Reset function for development (force new client creation)
export function resetClient() {
  console.log('🔄 [Supabase Client] Resetting singleton instance')
  supabaseInstance = null
}

export function createClient() {
  // ALWAYS return existing instance if available (singleton pattern)
  if (supabaseInstance) {
    console.log('♻️ [Supabase Client] Returning existing singleton instance')
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

  console.log('Creating new Supabase client singleton')
  console.log('URL:', supabaseUrl)
  console.log('Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...')

  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storageKey: 'atlas-auth-token',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    global: {
      headers: {
        'x-client-info': 'atlas-cms',
      },
      // Configure fetch with 10-second timeout using AbortController
      fetch: (url, options = {}) => {
        console.log('🌐 [Supabase Client] Custom fetch called:', url)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
          console.warn('⏱️ [Supabase Client] Aborting request after 10 seconds:', url)
          controller.abort()
        }, 10000) // 10 second timeout
        
        return fetch(url, {
          ...options,
          signal: controller.signal,
        }).finally(() => {
          clearTimeout(timeoutId)
        })
      },
    },
  })

  return supabaseInstance
}
