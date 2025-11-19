import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample data that matches the actual database schema
const projectsData = [
  {
    id: 1,
    country: 'Kenya',
    title: 'Clean Energy Initiative Kenya',
    date: '2024-01-15',
    corruptionType: 'Clean Energy',
    details: 'Developing renewable energy infrastructure in rural Kenya to provide sustainable electricity access to over 100,000 households.',
    latitude: -1.2921,
    longitude: 36.8219,
    status: 'published'
  },
  {
    id: 2,
    country: 'Brazil', 
    title: 'Sustainable Agriculture Program Brazil',
    date: '2024-02-20',
    corruptionType: 'Agriculture',
    details: 'Supporting smallholder farmers with climate-resilient agricultural practices and improved crop yields.',
    latitude: -14.2350,
    longitude: -51.9253,
    status: 'published'
  },
  {
    id: 3,
    country: 'India',
    title: 'Urban Water Management India', 
    date: '2024-03-10',
    corruptionType: 'Water Management',
    details: 'Improving water infrastructure and sanitation systems in major Indian cities.',
    latitude: 20.5937,
    longitude: 78.9629,
    status: 'published'
  }
]

const newsData = [
  {
    id: 1,
    slug: 'climate-adaptation-fund-launches',
    category: 'Climate Finance',
    title: 'New Climate Adaptation Fund Launches',
    description: 'A $2 billion fund to support climate adaptation projects in vulnerable communities worldwide.',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=600&fit=crop',
    tagColor: 'green',
    tags: ['Climate', 'Finance', 'Adaptation'],
    publishDate: '2024-01-15',
    status: 'published'
  },
  {
    id: 2,
    slug: 'renewable-energy-storage-breakthrough',
    category: 'Technology',
    title: 'Breakthrough in Renewable Energy Storage',
    description: 'New battery technology promises to revolutionize renewable energy storage capabilities.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    tagColor: 'blue',
    tags: ['Technology', 'Storage', 'Renewable'],
    publishDate: '2024-02-01',
    status: 'published'
  }
]

const publicationsData = [
  {
    id: 1,
    slug: 'climate-action-report-2024',
    category: 'Reports',
    title: 'Climate Action Report 2024',
    description: 'Comprehensive analysis of global climate action progress and recommendations.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop',
    tagColor: 'purple',
    tags: ['Climate', 'Report', '2024'],
    publishDate: '2024-01-01',
    documentNames: ['Climate Action Report 2024.pdf'],
    documentUrls: ['https://example.com/climate-report-2024.pdf'],
    status: 'published'
  }
]

const videosData = [
  {
    id: 1,
    slug: 'understanding-climate-finance',
    category: 'Education',
    title: 'Understanding Climate Finance',
    description: 'An introduction to climate finance mechanisms and their impact.',
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    tagColor: 'orange',
    tags: ['Education', 'Finance', 'Climate'],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    publishDate: '2024-01-10',
    status: 'published'
  }
]

async function migrateData() {
  try {
    console.log('🚀 Starting data migration...')

    // Insert projects
    console.log('📦 Inserting projects...')
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .upsert(projectsData, { onConflict: 'id' })
    
    if (projectsError) {
      console.error('❌ Error inserting projects:', projectsError)
    } else {
      console.log('✅ Projects inserted successfully:', projectsData.length, 'projects')
    }

    // Insert news
    console.log('📰 Inserting news...')
    const { data: news, error: newsError } = await supabase
      .from('news')
      .upsert(newsData, { onConflict: 'id' })
    
    if (newsError) {
      console.error('❌ Error inserting news:', newsError)
    } else {
      console.log('✅ News inserted successfully:', newsData.length, 'articles')
    }

    // Insert publications
    console.log('📚 Inserting publications...')
    const { data: publications, error: publicationsError } = await supabase
      .from('publications')
      .upsert(publicationsData, { onConflict: 'id' })
    
    if (publicationsError) {
      console.error('❌ Error inserting publications:', publicationsError)
    } else {
      console.log('✅ Publications inserted successfully:', publicationsData.length, 'publications')
    }

    // Insert videos
    console.log('🎥 Inserting videos...')
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .upsert(videosData, { onConflict: 'id' })
    
    if (videosError) {
      console.error('❌ Error inserting videos:', videosError)
    } else {
      console.log('✅ Videos inserted successfully:', videosData.length, 'videos')
    }

    // Insert categories and types
    const categories = ['Climate Finance', 'Technology', 'Policy', 'Research', 'Reports', 'Education']
    console.log('🏷️ Inserting news categories...')
    for (const category of categories) {
      const { error } = await supabase
        .from('news_categories')
        .upsert({ name: category }, { onConflict: 'name' })
      
      if (error && !error.message.includes('duplicate')) {
        console.error(`❌ Error inserting category ${category}:`, error)
      }
    }

    // Insert publication types
    const publicationTypes = ['Report', 'Policy Brief', 'Research Paper', 'Case Study']
    console.log('📑 Inserting publication types...')
    for (const type of publicationTypes) {
      const { error } = await supabase
        .from('publication_types')
        .upsert({ name: type }, { onConflict: 'name' })
      
      if (error && !error.message.includes('duplicate')) {
        console.error(`❌ Error inserting publication type ${type}:`, error)
      }
    }

    console.log('🎉 Data migration completed successfully!')

  } catch (error) {
    console.error('💥 Migration failed:', error)
  }
}

migrateData()