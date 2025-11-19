import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { projectCardsData } from '../src/lib/constants'

// Load environment variables
config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateAllProjects() {
  try {
    console.log(`🚀 Starting migration of ${projectCardsData.length} projects...`)

    // Transform the projects to match the database schema
    const projectsForDb = projectCardsData.map(project => ({
      id: project.id,
      country: project.country,
      title: project.title,
      date: project.date,
      corruptionType: project.corruptionType,
      details: project.details,
      latitude: project.latitude,
      longitude: project.longitude,
      status: project.status || 'published',
      publishDate: project.publishDate
    }))

    console.log('📦 Inserting all projects in batches...')
    
    // Insert in batches of 50 to avoid overwhelming the database
    const batchSize = 50
    for (let i = 0; i < projectsForDb.length; i += batchSize) {
      const batch = projectsForDb.slice(i, i + batchSize)
      console.log(`📦 Inserting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(projectsForDb.length/batchSize)} (${batch.length} projects)...`)
      
      const { data, error } = await supabase
        .from('projects')
        .upsert(batch, { onConflict: 'id' })
      
      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error)
        break
      } else {
        console.log(`✅ Batch ${Math.floor(i/batchSize) + 1} inserted successfully`)
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('🎉 All projects migration completed!')
    console.log(`📊 Total projects in database: ${projectCardsData.length}`)
    console.log('🌐 Check your production site: https://citizens-atlas-ibizyo3gw-akawars-projects.vercel.app')

  } catch (error) {
    console.error('💥 Migration failed:', error)
  }
}

migrateAllProjects()