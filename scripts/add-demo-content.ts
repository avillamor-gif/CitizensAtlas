// Add demo content to Citizens Atlas
const DEMO_SUPABASE_URL = 'https://srsjynjccivtjvordrlc.supabase.co'
const DEMO_SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2p5bmpjY2l2dGp2b3JkcmxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODIwMTc2NSwiZXhwIjoyMDczNzc3NzY1fQ.sXesnBbiwklHz0dzc4WoXWS38R7HZKGM1cdMOyfc__g'

const demoProjects = [
  {
    title: "Greenwashed Solar Farm in Brazil",
    country: "Brazil", 
    corruptionType: "False Solutions",
    details: "A large solar farm project marketed as sustainable development that displaced indigenous communities and destroyed local ecosystems while providing minimal benefits to the region.",
    latitude: -14.235,
    longitude: -51.9253,
    status: "published"
  },
  {
    title: "Carbon Credit Scam in Madagascar",
    country: "Madagascar",
    corruptionType: "Environmental Crime",
    details: "A fraudulent carbon offset scheme that claimed to protect forests while actually enabling illegal logging operations and providing false carbon credits to corporations.",
    latitude: -18.766947,
    longitude: 46.869107,
    status: "published"
  },
  {
    title: "Plastic Recycling Myth in Philippines", 
    country: "Philippines",
    corruptionType: "False Solutions",
    details: "A corporate recycling program that claimed to solve plastic waste but actually exported most waste to other countries while marketing itself as circular economy solution.",
    latitude: 12.8797,
    longitude: 121.774,
    status: "published"
  }
]

const demoNews = [
  {
    title: "New Report Exposes Corporate Greenwashing in Southeast Asia",
    slug: "corporate-greenwashing-southeast-asia",
    category: "Research",
    description: "A comprehensive investigation reveals how major corporations use misleading environmental claims to hide continued harmful practices across the region.",
    status: "published",
    publishDate: "2024-11-20"
  },
  {
    title: "Indigenous Communities Fight Back Against False Climate Solutions",
    slug: "indigenous-communities-fight-false-solutions", 
    category: "Activism",
    description: "Community leaders across Latin America unite to oppose projects that claim environmental benefits while destroying traditional lands and livelihoods.",
    status: "published",
    publishDate: "2024-11-18"
  },
  {
    title: "Carbon Markets Under Scrutiny as Fraud Cases Multiply",
    slug: "carbon-markets-fraud-cases",
    category: "Investigation",
    description: "Multiple carbon offset projects found to be providing fraudulent credits, raising questions about the entire voluntary carbon market system.",
    status: "published", 
    publishDate: "2024-11-15"
  }
]

const demoPublications = [
  {
    title: "The False Promise of Carbon Offsets: A Global Analysis",
    slug: "false-promise-carbon-offsets",
    category: "Research Report",
    description: "Comprehensive analysis of carbon offset schemes worldwide reveals widespread failures and fraudulent practices undermining climate goals.",
    status: "published",
    publishDate: "2024-11-01"
  },
  {
    title: "Greenwashing in the Circular Economy: Case Studies",
    slug: "greenwashing-circular-economy-cases",
    category: "Policy Brief",
    description: "Detailed examination of how corporations misuse circular economy concepts to justify continued unsustainable practices.",
    status: "published",
    publishDate: "2024-10-15"
  }
]

async function addDemoContent() {
  console.log('🌱 Adding demo content to Citizens Atlas...')
  
  try {
    // Add demo projects
    console.log('\n📍 Adding demo projects...')
    for (const project of demoProjects) {
      const response = await fetch(`${DEMO_SUPABASE_URL}/rest/v1/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEMO_SUPABASE_SERVICE_KEY}`,
          'apikey': DEMO_SUPABASE_SERVICE_KEY,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(project)
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Added project: ${project.title}`)
      } else {
        const error = await response.text()
        console.log(`⚠️ Project might already exist: ${project.title}`)
      }
    }
    
    // Add demo news
    console.log('\n📰 Adding demo news...')
    for (const article of demoNews) {
      const response = await fetch(`${DEMO_SUPABASE_URL}/rest/v1/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEMO_SUPABASE_SERVICE_KEY}`,
          'apikey': DEMO_SUPABASE_SERVICE_KEY,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(article)
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Added news: ${article.title}`)
      } else {
        const error = await response.text()
        console.log(`⚠️ News might already exist: ${article.title}`)
      }
    }
    
    // Add demo publications
    console.log('\n📚 Adding demo publications...')
    for (const pub of demoPublications) {
      const response = await fetch(`${DEMO_SUPABASE_URL}/rest/v1/publications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEMO_SUPABASE_SERVICE_KEY}`,
          'apikey': DEMO_SUPABASE_SERVICE_KEY,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(pub)
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Added publication: ${pub.title}`)
      } else {
        const error = await response.text()
        console.log(`⚠️ Publication might already exist: ${pub.title}`)
      }
    }
    
    console.log('\n🎉 Demo content added successfully!')
    console.log('🌐 Visit https://citizens-atlas.vercel.app to see the content')
    
  } catch (error) {
    console.error('❌ Error adding demo content:', error)
  }
}

// Run the demo content addition
addDemoContent()