import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function makeUserSuperAdmin() {
  const email = 'alberto.b.villamor@gmail.com'
  
  console.log(`🔄 Updating ${email} to super-admin...\n`)
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'super-admin' })
    .eq('email', email)
    .select()
  
  if (error) {
    console.error('❌ Error:', error)
    return
  }
  
  if (data && data.length > 0) {
    console.log('✅ Success! User updated:')
    console.log(`   Email: ${data[0].email}`)
    console.log(`   Role: ${data[0].role}`)
    console.log(`   Name: ${data[0].full_name}`)
    console.log('\n🎉 You can now see the edit buttons on the What We Do page!')
    console.log('📝 Please log out and log back in to refresh your session.')
  } else {
    console.log('⚠️ No user found with that email')
  }
}

makeUserSuperAdmin()
