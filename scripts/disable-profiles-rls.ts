import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function disableRLS() {
  console.log('🔧 Disabling RLS on profiles table...')
  
  try {
    // Disable RLS using raw SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;'
    })
    
    if (error) {
      console.error('❌ Error:', error)
      console.log('\n⚠️  Manual fix needed:')
      console.log('Go to Supabase SQL Editor and run:')
      console.log('ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;')
    } else {
      console.log('✅ RLS disabled on profiles table!')
      console.log('Now all users can read profile data regardless of authentication')
    }
  } catch (error) {
    console.error('❌ Error:', error)
    console.log('\n⚠️  Manual fix needed:')
    console.log('Go to Supabase SQL Editor and run:')
    console.log('ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;')
  }
}

disableRLS()
