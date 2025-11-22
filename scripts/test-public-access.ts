import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Test direct connection to Supabase without auth
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testPublicAccess() {
  try {
    console.log('🔍 Testing public access to Supabase...')
    console.log('🌐 URL:', supabaseUrl)
    console.log('🔑 Anon Key (first 20):', supabaseAnonKey.substring(0, 20) + '...')

    // Test public access to projects (should work without auth if RLS allows it)
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, title, country')
      .eq('status', 'published')
      .limit(3)
    
    if (projectsError) {
      console.error('❌ Error accessing projects:', projectsError)
    } else {
      console.log('✅ Public projects access works:', projects?.length, 'projects found')
      console.log('📦 Sample projects:', projects)
    }

    // Test if we can create a basic auth user (to test auth system)
    console.log('🔐 Testing auth system...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@test.com', // This will fail, but tells us if auth is working
      password: 'wrongpassword'
    })

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        console.log('✅ Auth system is working (got expected invalid credentials error)')
      } else {
        console.error('❌ Auth system error:', authError.message)
      }
    }

  } catch (error) {
    console.error('💥 Test failed:', error)
  }
}

testPublicAccess()