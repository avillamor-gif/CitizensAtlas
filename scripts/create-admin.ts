import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  try {
    console.log('🔑 Creating admin user...')
    
    const adminEmail = 'akawar@gmail.com'
    const adminPassword = 'Atlas123!' // You can change this
    
    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        role: 'super-admin',
        full_name: 'Admin User'
      }
    })
    
    if (authError) {
      console.error('❌ Error creating auth user:', authError)
      return
    }
    
    console.log('✅ Auth user created:', authData.user?.id)
    
    // Add user to the users table
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: authData.user!.id,
        email: adminEmail,
        role: 'super-admin',
        full_name: 'Admin User'
      })
    
    if (userError) {
      console.error('❌ Error creating user record:', userError)
    } else {
      console.log('✅ User record created successfully')
    }
    
    console.log('🎉 Admin user setup completed!')
    console.log('📧 Email:', adminEmail)
    console.log('🔐 Password:', adminPassword)
    console.log('🌐 You can now login at: https://citizens-atlas-ibizyo3gw-akawars-projects.vercel.app/auth/login')
    
  } catch (error) {
    console.error('💥 Failed to create admin user:', error)
  }
}

createAdminUser()