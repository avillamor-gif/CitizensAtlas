import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkUserRole() {
  console.log('🔍 Checking user profiles...\n')
  
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, created_at')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('❌ Error:', error)
    return
  }
  
  if (!profiles || profiles.length === 0) {
    console.log('⚠️ No profiles found in database')
    return
  }
  
  console.log('📋 User Profiles:\n')
  profiles.forEach((profile, index) => {
    console.log(`${index + 1}. ${profile.email}`)
    console.log(`   Role: ${profile.role || '(no role set)'}`)
    console.log(`   Name: ${profile.full_name || '(no name)'}`)
    console.log(`   ID: ${profile.id}`)
    console.log('')
  })
  
  const adminCount = profiles.filter(p => p.role === 'super-admin' || p.role === 'admin').length
  console.log(`✅ Total users: ${profiles.length}`)
  console.log(`👤 Admins: ${adminCount}`)
}

checkUserRole()
