import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const adminEmail = 'akawar@gmail.com'
  const adminPassword = 'Tt123456'
  const adminName = 'Admin User'

  console.log('🔧 Creating admin user...')
  console.log(`Email: ${adminEmail}`)

  try {
    // Create user with admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: adminName,
        role: 'admin'
      }
    })

    if (authError) {
      console.error('❌ Failed to create auth user:', authError)
      return
    }

    console.log('✅ Auth user created:', authData.user.id)

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        email: adminEmail,
        name: adminName,
        role: 'admin',
        created_at: new Date().toISOString()
      }])

    if (profileError) {
      console.error('❌ Failed to create profile:', profileError)
      return
    }

    console.log('✅ Profile created')
    console.log('')
    console.log('==================================================')
    console.log('✅ Admin user ready!')
    console.log('==================================================')
    console.log(`Email: ${adminEmail}`)
    console.log(`Password: ${adminPassword}`)
    console.log(`Role: admin`)
    console.log('==================================================')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

createAdminUser()
