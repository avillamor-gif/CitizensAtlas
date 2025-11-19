import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS policies for production...')
  
  try {
    console.log('📋 Current issue: Anonymous users cannot read profiles table')
    console.log('🎯 Solution: Update RLS policies to allow profile reads with proper authentication')
    
    console.log('')
    console.log('🔗 MANUAL STEPS REQUIRED:')
    console.log('1. Go to Supabase Dashboard: https://app.supabase.com/project/srsjynjccivtjvordrlc/auth/policies')
    console.log('2. Find the "profiles" table policies')
    console.log('3. Update or create a policy to allow SELECT for authenticated users')
    console.log('')
    console.log('📝 Suggested RLS Policy for profiles table:')
    console.log('   Policy Name: "Allow users to read their own profile and public profiles"')
    console.log('   Operation: SELECT')
    console.log('   Target Roles: authenticated, anon')
    console.log('   USING expression: true')
    console.log('   WITH CHECK expression: (leave empty)')
    console.log('')
    
    // Alternative: Test if we can update the policy programmatically
    console.log('🧪 Testing alternative: Enable RLS but allow authenticated access...')
    
    // For now, let\'s check what policies exist
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'profiles' })
      .select('*')
    
    if (policiesError) {
      console.log('❌ Could not check policies programmatically:', policiesError.message)
    } else {
      console.log('✅ Current policies:', policies)
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }

  console.log('')
  console.log('🚨 IMMEDIATE WORKAROUND:')
  console.log('For testing, you can temporarily disable RLS on profiles table:')
  console.log('1. Go to: https://app.supabase.com/project/srsjynjccivtjvordrlc/editor')
  console.log('2. Run SQL: ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;')
  console.log('3. Test if the app works, then re-enable with proper policies')
  console.log('')
}

fixRLSPolicies()