import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkProfiles() {
  console.log('🔍 Checking profiles table...')
  
  try {
    // Check with service role key (admin access)
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
    
    if (error) {
      console.error('❌ Error querying profiles:', error)
    } else {
      console.log(`✅ Found ${profiles.length} profiles:`)
      profiles.forEach(profile => {
        console.log(`   - ${profile.email}: ${profile.role} (ID: ${profile.id})`)
      })
    }

    // Test with anon key
    const anonSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data: anonProfiles, error: anonError } = await anonSupabase
      .from('profiles')
      .select('*')
    
    if (anonError) {
      console.log(`❌ Anon access to profiles failed: ${anonError.message}`)
      console.log('   This might be due to RLS policies')
    } else {
      console.log(`✅ Anon access to profiles works: ${anonProfiles.length} profiles visible`)
    }

  } catch (error) {
    console.error('❌ Exception:', error)
  }
}

checkProfiles()