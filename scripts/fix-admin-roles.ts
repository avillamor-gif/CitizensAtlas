// Fix admin user roles on production
(async () => {
const SUPABASE_URL = 'https://srsjynjccivtjvordrlc.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2p5bmpjY2l2dGp2b3JkcmxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODIwMTc2NSwiZXhwIjoyMDczNzc3NzY1fQ.sXesnBbiwklHz0dzc4WoXWS38R7HZKGM1cdMOyfc__g'

async function fixAdminRoles() {
  console.log('🔧 Fixing admin user roles on production...')
  
  try {
    // 1. First, check current users and their roles
    console.log('\n1. Checking current users and roles...')
    const usersResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      }
    })
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json()
      console.log('📋 Current users:', usersData.users.map((u: any) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        email_confirmed_at: u.email_confirmed_at
      })))
      
      // Find the admin users
      const adminUsers = usersData.users.filter((u: any) => 
        u.email === 'akawar@gmail.com' || 
        u.email === 'alberto.b.villamor@gmail.com'
      )
      
      console.log('👨‍💼 Found admin users:', adminUsers.map((u: any) => ({
        id: u.id,
        email: u.email
      })))
      
      // 2. Check current profiles
      console.log('\n2. Checking current profiles...')
      const profilesResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'apikey': SUPABASE_SERVICE_KEY
        }
      })
      
      if (profilesResponse.ok) {
        const profilesData = await profilesResponse.json()
        console.log('👤 Current profiles:', profilesData.map((p: any) => ({
          id: p.id,
          email: p.email,
          role: p.role,
          full_name: p.full_name
        })))
        
        // 3. Create/update profiles for admin users
        console.log('\n3. Creating/updating admin profiles...')
        
        for (const adminUser of adminUsers) {
          const role = adminUser.email === 'akawar@gmail.com' ? 'super-admin' : 'admin'
          
          console.log(`Setting ${adminUser.email} as ${role}...`)
          
          // Try to update first
          const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${adminUser.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'apikey': SUPABASE_SERVICE_KEY,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              role: role,
              email: adminUser.email,
              full_name: adminUser.email.split('@')[0]
            })
          })
          
          if (updateResponse.ok) {
            const updateData = await updateResponse.json()
            console.log(`✅ Updated profile for ${adminUser.email}:`, updateData)
          } else if (updateResponse.status === 404 || updateResponse.status === 406) {
            // Profile doesn't exist, create it
            console.log(`📝 Creating new profile for ${adminUser.email}...`)
            
            const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'apikey': SUPABASE_SERVICE_KEY,
                'Prefer': 'return=representation'
              },
              body: JSON.stringify({
                id: adminUser.id,
                email: adminUser.email,
                role: role,
                full_name: adminUser.email.split('@')[0],
                avatar_url: null
              })
            })
            
            if (createResponse.ok) {
              const createData = await createResponse.json()
              console.log(`✅ Created profile for ${adminUser.email}:`, createData)
            } else {
              const errorText = await createResponse.text()
              console.log(`❌ Failed to create profile for ${adminUser.email}:`, createResponse.status, errorText)
            }
          } else {
            const errorText = await updateResponse.text()
            console.log(`❌ Failed to update profile for ${adminUser.email}:`, updateResponse.status, errorText)
          }
        }
        
        // 4. Verify final profiles
        console.log('\n4. Verifying final profiles...')
        const finalProfilesResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, {
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'apikey': SUPABASE_SERVICE_KEY
          }
        })
        
        if (finalProfilesResponse.ok) {
          const finalProfilesData = await finalProfilesResponse.json()
          console.log('🎯 Final profiles:', finalProfilesData.map((p: any) => ({
            id: p.id,
            email: p.email,
            role: p.role,
            full_name: p.full_name
          })))
        }
        
      } else {
        const error = await profilesResponse.text()
        console.log('❌ Failed to get profiles:', profilesResponse.status, error)
      }
      
    } else {
      const error = await usersResponse.text()
      console.log('❌ Failed to get users:', usersResponse.status, error)
    }
    
  } catch (error) {
    console.error('❌ Error fixing admin roles:', error)
  }
}

// Run the fix
await fixAdminRoles()
})()