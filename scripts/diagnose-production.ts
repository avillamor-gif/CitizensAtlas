import { createClient } from '@supabase/supabase-js'

// Production environment check
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
const appUrl = process.env.NEXT_PUBLIC_APP_URL

async function diagnoseProduction() {
  console.log('🔍 PRODUCTION ENVIRONMENT DIAGNOSIS')
  console.log('====================================')
  
  // 1. Environment Variables Check
  console.log('📋 Environment Variables:')
  console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`)
  console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`)
  console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${serviceRoleKey ? '✅ Set' : '❌ Missing'}`)
  console.log(`   NEXT_PUBLIC_SITE_URL: ${siteUrl ? '✅ Set' : '❌ Missing'}`)
  console.log(`   NEXT_PUBLIC_APP_URL: ${appUrl ? '✅ Set' : '❌ Missing'}`)
  console.log('')

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Critical environment variables missing! Cannot proceed.')
    return
  }

  // 2. Database Connection Test
  console.log('🔌 Testing Database Connection...')
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test basic connection with anon key
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, title, status')
      .limit(5)
    
    if (projectsError) {
      console.log(`❌ Projects query failed: ${projectsError.message}`)
    } else {
      console.log(`✅ Projects query successful: ${projects?.length || 0} projects found`)
      console.log('   Sample projects:', projects?.slice(0, 2).map(p => `${p.title} (${p.status})`))
    }

    // Test user profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .limit(5)
    
    if (profilesError) {
      console.log(`❌ Profiles query failed: ${profilesError.message}`)
    } else {
      console.log(`✅ Profiles query successful: ${profiles?.length || 0} profiles found`)
      console.log('   Sample profiles:', profiles?.map(p => `${p.email} (${p.role})`))
    }

  } catch (error) {
    console.log(`❌ Database connection failed: ${error}`)
  }

  // 3. Service Role Key Test
  console.log('')
  console.log('🔑 Testing Service Role Key...')
  if (serviceRoleKey) {
    try {
      const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })

      const { data: users, error: usersError } = await adminSupabase.auth.admin.listUsers()
      
      if (usersError) {
        console.log(`❌ Admin users query failed: ${usersError.message}`)
      } else {
        console.log(`✅ Admin users query successful: ${users?.users?.length || 0} users found`)
        const adminUsers = users?.users?.filter(u => 
          u.email === 'akawar@gmail.com' || u.email === 'alberto.b.villamor@gmail.com'
        )
        console.log('   Admin users found:', adminUsers?.map(u => u.email))
      }

    } catch (error) {
      console.log(`❌ Service role key test failed: ${error}`)
    }
  } else {
    console.log('❌ Service role key not available for testing')
  }

  // 4. API Endpoint Test
  console.log('')
  console.log('🌐 Testing API Endpoints...')
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/projects?select=id,title,status&limit=3`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      console.log(`❌ REST API failed: ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      console.log(`   Error details: ${errorText}`)
    } else {
      const data = await response.json()
      console.log(`✅ REST API successful: ${data.length} projects returned`)
      console.log('   Sample data:', data.slice(0, 2))
    }

  } catch (error) {
    console.log(`❌ API endpoint test failed: ${error}`)
  }

  console.log('')
  console.log('🎯 DIAGNOSIS COMPLETE')
  console.log('===================')
  
  console.log('')
  console.log('🔧 RECOMMENDED FIXES:')
  console.log('1. Ensure all environment variables are set in Vercel dashboard')
  console.log('2. Redeploy after updating environment variables')
  console.log('3. Check Supabase Auth URL configuration')
  console.log('4. Verify Supabase RLS policies allow anonymous read access')
}

diagnoseProduction()