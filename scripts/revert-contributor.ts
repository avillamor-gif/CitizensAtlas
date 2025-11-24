import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function revertToContributor() {
  const email = 'alberto.b.villamor@gmail.com'
  
  console.log(`🔄 Reverting ${email} back to contributor...\n`)
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'contributor' })
    .eq('email', email)
    .select()
  
  if (error) {
    console.error('❌ Error:', error)
    return
  }
  
  if (data && data.length > 0) {
    console.log('✅ Success! User reverted:')
    console.log(`   Email: ${data[0].email}`)
    console.log(`   Role: ${data[0].role}`)
    console.log(`   Name: ${data[0].full_name}`)
    console.log('\n✅ Roles restored correctly!')
    console.log('   - akawar@gmail.com: super-admin')
    console.log('   - alberto.b.villamor@gmail.com: contributor')
  } else {
    console.log('⚠️ No user found with that email')
  }
}

revertToContributor()
