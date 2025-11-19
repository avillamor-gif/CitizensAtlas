import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function updateSupabaseAuthSettings() {
  try {
    console.log('🔧 Updating Supabase Auth settings...')
    
    console.log('❌ This needs to be done via Supabase Dashboard')
    console.log('🌐 Go to: https://app.supabase.com/project/srsjynjccivtjvordrlc/auth/url-configuration')
    console.log('📝 Set Site URL to: https://citizens-atlas.vercel.app')
    console.log('📝 Add redirect URL: https://citizens-atlas.vercel.app/**')
    
  } catch (error) {
    console.error('💥 Error:', error)
  }
}

updateSupabaseAuthSettings()