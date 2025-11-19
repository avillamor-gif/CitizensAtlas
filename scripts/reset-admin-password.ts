import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function resetAdminPassword() {
  const adminEmail = 'akawar@gmail.com'
  const newPassword = 'Tt123456'

  console.log('🔧 Resetting admin password...')
  console.log(`Email: ${adminEmail}`)

  try {
    // Get user by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Failed to list users:', listError)
      return
    }

    const user = users.find(u => u.email === adminEmail)
    
    if (!user) {
      console.error('❌ User not found')
      return
    }

    console.log('✅ Found user:', user.id)

    // Update password
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    )

    if (error) {
      console.error('❌ Failed to reset password:', error)
      return
    }

    console.log('✅ Password reset successfully')

    // Check/create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code === 'PGRST116') {
      console.log('⚠️  No profile found, creating one...')
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: adminEmail,
          name: 'Admin User',
          role: 'admin',
          created_at: new Date().toISOString()
        }])

      if (insertError) {
        console.error('❌ Failed to create profile:', insertError)
      } else {
        console.log('✅ Profile created')
      }
    } else if (profile) {
      console.log('✅ Profile exists:', profile.role)
      
      // Update role to admin if needed
      if (profile.role !== 'admin') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', user.id)
        
        if (!updateError) {
          console.log('✅ Role updated to admin')
        }
      }
    }

    console.log('')
    console.log('==================================================')
    console.log('✅ Admin account ready!')
    console.log('==================================================')
    console.log(`Email: ${adminEmail}`)
    console.log(`Password: ${newPassword}`)
    console.log(`User ID: ${user.id}`)
    console.log('==================================================')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

resetAdminPassword()
