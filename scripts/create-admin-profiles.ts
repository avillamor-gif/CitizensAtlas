import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://srsjynjccivtjvordrlc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2p5bmpjY2l2dGp2b3JkcmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMDE3NjUsImV4cCI6MjA3Mzc3Nzc2NX0.YOyYebTJSgq0bEcBQDXsNCiK6WPvB8lViSKtquzkdGE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdminProfiles() {
  console.log('🔄 Creating admin user profiles...')
  
  try {
    // Create super-admin profile for akawar@gmail.com
    const superAdminProfile = {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // Generate a UUID for akawar@gmail.com
      email: 'akawar@gmail.com',
      full_name: 'Akawar Super Admin',
      role: 'super-admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Create admin profile for alberto.b.villamor@gmail.com  
    const adminProfile = {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d480', // Generate a UUID for alberto
      email: 'alberto.b.villamor@gmail.com',
      full_name: 'Alberto Villamor Admin',
      role: 'admin', 
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('📝 Inserting super-admin profile:', superAdminProfile)
    const { data: superAdminData, error: superAdminError } = await supabase
      .from('profiles')
      .insert([superAdminProfile])
      .select()
    
    if (superAdminError) {
      console.error('❌ Error creating super-admin profile:', superAdminError)
    } else {
      console.log('✅ Super-admin profile created:', superAdminData)
    }
    
    console.log('📝 Inserting admin profile:', adminProfile)
    const { data: adminData, error: adminError } = await supabase
      .from('profiles')
      .insert([adminProfile])
      .select()
    
    if (adminError) {
      console.error('❌ Error creating admin profile:', adminError)
    } else {
      console.log('✅ Admin profile created:', adminData)
    }
    
    // Verify the profiles were created
    const { data: allProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (fetchError) {
      console.error('❌ Error fetching profiles:', fetchError)
    } else {
      console.log('📋 All profiles in database:')
      allProfiles?.forEach(profile => {
        console.log(`  - ${profile.email}: ${profile.role}`)
      })
    }
    
    console.log('✅ Admin profiles setup complete!')
    
  } catch (error) {
    console.error('❌ Error in createAdminProfiles:', error)
  }
}

createAdminProfiles()