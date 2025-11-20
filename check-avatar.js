import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkAvatar() {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, full_name, avatar_url')
    .eq('email', 'akawar@gmail.com')
    .single()
  
  console.log('Profile data:', data)
  console.log('Error:', error)
}

checkAvatar()
