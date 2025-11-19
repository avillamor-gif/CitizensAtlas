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

async function setupAdminUsers() {
  const users = [
    {
      email: 'akawar@gmail.com',
      password: 'Tt123456', 
      role: 'super-admin',
      name: 'Super Admin User'
    },
    {
      email: 'alberto.b.villamor@gmail.com',
      password: 'Tt123456',
      role: 'admin', 
      name: 'Admin User'
    }
  ]

  console.log('🔧 Setting up admin users...')

  try {
    // Get all users
    const { data: { users: allUsers }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Failed to list users:', listError)
      return
    }

    for (const adminUser of users) {
      console.log(`\n👤 Processing: ${adminUser.email}`)
      
      const existingUser = allUsers.find(u => u.email === adminUser.email)
      
      if (!existingUser) {
        console.log(`⚠️  User ${adminUser.email} not found, creating...`)
        
        // Create user
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: adminUser.email,
          password: adminUser.password,
          email_confirm: true
        })

        if (createError) {
          console.error(`❌ Failed to create user ${adminUser.email}:`, createError)
          continue
        }

        console.log(`✅ User created: ${newUser.user?.id}`)

        // Create profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: newUser.user!.id,
            email: adminUser.email,
            full_name: adminUser.name,
            role: adminUser.role,
            created_at: new Date().toISOString()
          }])

        if (insertError) {
          console.error(`❌ Failed to create profile for ${adminUser.email}:`, insertError)
        } else {
          console.log(`✅ Profile created with role: ${adminUser.role}`)
        }

      } else {
        console.log(`✅ Found existing user: ${existingUser.id}`)

        // Update password
        const { error: passwordError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          { password: adminUser.password }
        )

        if (passwordError) {
          console.error(`❌ Failed to reset password for ${adminUser.email}:`, passwordError)
        } else {
          console.log(`✅ Password updated`)
        }

        // Check/update profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', existingUser.id)
          .single()

        if (profileError && profileError.code === 'PGRST116') {
          console.log('⚠️  No profile found, creating one...')
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{
              id: existingUser.id,
              email: adminUser.email,
              full_name: adminUser.name,
              role: adminUser.role,
              created_at: new Date().toISOString()
            }])

          if (insertError) {
            console.error(`❌ Failed to create profile for ${adminUser.email}:`, insertError)
          } else {
            console.log(`✅ Profile created with role: ${adminUser.role}`)
          }
        } else if (profile) {
          console.log(`🔍 Current role: ${profile.role} → Target: ${adminUser.role}`)
          
          // Update role and name if needed
          if (profile.role !== adminUser.role || profile.full_name !== adminUser.name) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ 
                role: adminUser.role,
                full_name: adminUser.name 
              })
              .eq('id', existingUser.id)
            
            if (!updateError) {
              console.log(`✅ Profile updated to role: ${adminUser.role}`)
            } else {
              console.error(`❌ Failed to update profile:`, updateError)
            }
          } else {
            console.log(`✅ Profile already has correct role: ${adminUser.role}`)
          }
        }
      }
    }

    console.log('')
    console.log('==================================================')
    console.log('✅ Admin users setup complete!')
    console.log('==================================================')
    users.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user.email} | Password: ${user.password}`)
    })
    console.log('==================================================')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

setupAdminUsers()
