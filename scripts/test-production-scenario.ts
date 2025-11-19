import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function testProductionScenario() {
  try {
    console.log('🔍 Simulating production site access...')

    // Test 1: Direct REST API call with anon key (like the site would do)
    console.log('📡 Testing direct REST API call...')
    const response = await fetch(`${supabaseUrl}/rest/v1/projects?select=*&eq.status.published&limit=5`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Direct REST API works:', data.length, 'projects')
    } else {
      const error = await response.text()
      console.error('❌ Direct REST API failed:', response.status, error)
    }

    // Test 2: Using the getPublishedProjects function
    console.log('📚 Testing getPublishedProjects function...')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data: published, error: publishedError } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .limit(5)

    if (publishedError) {
      console.error('❌ getPublishedProjects error:', publishedError)
    } else {
      console.log('✅ getPublishedProjects works:', published?.length, 'projects')
    }

    // Test 3: Check if there are any projects without status='published'
    console.log('🔍 Checking project status distribution...')
    const { data: allProjects, error: allError } = await supabase
      .from('projects')
      .select('status')

    if (!allError) {
      const statusCounts = allProjects.reduce((acc, p) => {
        const status = p.status || 'null'
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      console.log('📊 Status distribution:', statusCounts)
    }

  } catch (error) {
    console.error('💥 Test failed:', error)
  }
}

testProductionScenario()