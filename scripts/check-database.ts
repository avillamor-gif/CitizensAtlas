import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabase() {
  try {
    console.log('🔍 Checking production database...')
    console.log('🌐 Supabase URL:', supabaseUrl)

    // Check projects count
    const { data: projects, error: projectsError, count } = await supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .limit(5)
    
    if (projectsError) {
      console.error('❌ Error fetching projects:', projectsError)
    } else {
      console.log('✅ Projects in database:', count)
      console.log('📦 Sample projects:', projects?.map(p => ({ id: p.id, title: p.title?.substring(0, 50) + '...' })))
    }

    // Check news count
    const { data: news, error: newsError, count: newsCount } = await supabase
      .from('news')
      .select('*', { count: 'exact' })
    
    if (newsError) {
      console.error('❌ Error fetching news:', newsError)
    } else {
      console.log('✅ News in database:', newsCount)
    }

    // Check publications count
    const { data: publications, error: publicationsError, count: pubCount } = await supabase
      .from('publications')
      .select('*', { count: 'exact' })
    
    if (publicationsError) {
      console.error('❌ Error fetching publications:', publicationsError)
    } else {
      console.log('✅ Publications in database:', pubCount)
    }

    // Check videos count
    const { data: videos, error: videosError, count: videoCount } = await supabase
      .from('videos')
      .select('*', { count: 'exact' })
    
    if (videosError) {
      console.error('❌ Error fetching videos:', videosError)
    } else {
      console.log('✅ Videos in database:', videoCount)
    }

  } catch (error) {
    console.error('💥 Database check failed:', error)
  }
}

checkDatabase()