// Test direct Supabase connection from production
const SUPABASE_URL = 'https://srsjynjccivtjvordrlc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2p5bmpjY2l2dGp2b3JkcmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMDE3NjUsImV4cCI6MjA3Mzc3Nzc2NX0.YOyYebTJSgq0bEcBQDXsNCiK6WPvB8lViSKtquzkdGE'

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection from production...')
  
  try {
    // Test 1: Basic connection to projects table (public read)
    console.log('\n1. Testing public access to projects table...')
    const publicResponse = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=id,title&limit=3`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    console.log('Public Response Status:', publicResponse.status)
    if (publicResponse.ok) {
      const publicData = await publicResponse.json()
      console.log('✅ Public access works! Found', publicData.length, 'projects')
      console.log('Sample projects:', publicData)
    } else {
      const error = await publicResponse.text()
      console.log('❌ Public access failed:', error)
    }
    
    // Test 2: CORS check
    console.log('\n2. Testing CORS headers...')
    console.log('Response headers:')
    for (const [key, value] of publicResponse.headers.entries()) {
      if (key.includes('cors') || key.includes('access-control')) {
        console.log(`  ${key}: ${value}`)
      }
    }
    
    // Test 3: Test news table
    console.log('\n3. Testing news table...')
    const newsResponse = await fetch(`${SUPABASE_URL}/rest/v1/news?select=id,title&limit=3`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    console.log('News Response Status:', newsResponse.status)
    if (newsResponse.ok) {
      const newsData = await newsResponse.json()
      console.log('✅ News access works! Found', newsData.length, 'articles')
      console.log('Sample news:', newsData)
    } else {
      const error = await newsResponse.text()
      console.log('❌ News access failed:', error)
    }
    
    // Test 4: Test RLS policies
    console.log('\n4. Testing RLS policy status...')
    const rlsResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/check_rls_status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({})
    })
    
    if (rlsResponse.ok) {
      const rlsData = await rlsResponse.json()
      console.log('RLS Status:', rlsData)
    } else {
      console.log('RLS check not available (expected)')
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error)
  }
}

// Run the test
testSupabaseConnection()