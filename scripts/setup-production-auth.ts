import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials for production setup')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupProductionAuth() {
  console.log('🔧 Setting up production auth configuration...')
  
  try {
    console.log('✅ Production environment variables ready!')
    console.log('')
    console.log('🔗 IMPORTANT: Update these settings in Supabase Dashboard:')
    console.log('   1. Go to https://app.supabase.com/project/srsjynjccivtjvordrlc/auth/url-configuration')
    console.log('   2. Update Site URL to: https://citizens-atlas.vercel.app')
    console.log('   3. Add Redirect URLs:')
    console.log('      - https://citizens-atlas.vercel.app/**')
    console.log('      - https://citizens-atlas.vercel.app/auth/**')
    console.log('   4. Update Email Templates to use production URLs')
    console.log('')
    console.log('🚀 Also ensure these environment variables are set in Vercel:')
    console.log('   - NEXT_PUBLIC_SUPABASE_URL')
    console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY')
    console.log('   - SUPABASE_SERVICE_ROLE_KEY')
    console.log('   - NEXT_PUBLIC_SITE_URL=https://citizens-atlas.vercel.app')
    console.log('   - NEXT_PUBLIC_APP_URL=https://citizens-atlas.vercel.app')
    console.log('')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

setupProductionAuth()