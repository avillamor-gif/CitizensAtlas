import { createClient } from '@/lib/supabase/client'
import { Project, Article } from '@/types/types'

// Get environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Get fresh supabase client with current auth state
function getSupabase() {
  return createClient()
}

const supabase = getSupabase()

// ============================================
// PROJECTS
// ============================================

// Get all projects WITH FULL DETAILS (for analytics)
// NOTE: This fetches ALL fields including details - only use for analytics
export async function getAllProjectsWithDetails() {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    // Fetch ALL fields for analytics (includes details field)
    const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*&order=id.desc`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('[Supabase] Loaded', data.length, 'projects with full details for analytics')
    return data as Project[]
  } catch (error) {
    console.error('Error in getAllProjectsWithDetails:', error)
    throw error
  }
}

// Get all projects (authenticated users only - for admin panel)
// OPTIMIZED: Only fetch fields needed for list view, not full content
export async function getProjects() {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    // Only select fields needed for table display - exclude large content fields
    const fields = 'id,title,country,status,submittedBy,submittedAt,publishDate,latitude,longitude'
    const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=${fields}&order=id.desc`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return data as Project[]
  } catch (error) {
    console.error('Error in getProjects:', error)
    throw error
  }
}

export async function getPublishedProjects() {
  try {
    const supabase = getSupabase()
    // OPTIMIZED: Server-side filtering + selective fields for faster queries
    const { data, error } = await supabase
      .from('projects')
      .select('id,title,country,status,submittedBy,submittedAt,publishDate,latitude,longitude')
      .or('status.eq.published,status.is.null')
      .order('id', { ascending: false })
    
    if (error) throw error
    
    return (data || []) as Project[]
  } catch (error) {
    console.error('Error in getPublishedProjects:', error)
    throw error
  }
}

// Get published projects WITH FULL DETAILS (for public map with investment amounts)
export async function getPublishedProjectsWithDetails() {
  try {
    const supabase = getSupabase()
    // Fetch ALL fields for map visualization (includes details field for investment amounts)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .or('status.eq.published,status.is.null')
      .order('id', { ascending: false })
    
    if (error) throw error
    
    console.log('[Supabase] Loaded', data?.length || 0, 'published projects with full details for map')
    return (data || []) as Project[]
  } catch (error) {
    console.error('Error in getPublishedProjectsWithDetails:', error)
    throw error
  }
}

export async function createProject(project: Omit<Project, 'id'>) {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  // Remove any ID field to prevent conflicts
  const { id, ...projectDataWithoutId } = project as any
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(projectDataWithoutId)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    const createdProject = Array.isArray(data) ? data[0] : data
    
    return createdProject as Project
  } catch (error) {
    console.error('Error in createProject:', error)
    throw error
  }
}

export async function updateProject(id: number, updates: Partial<Project>) {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(updates)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    const updatedProject = Array.isArray(data) ? data[0] : data
    
    return updatedProject as Project
  } catch (error) {
    console.error('Error in updateProject:', error)
    throw error
  }
}

export async function deleteProjects(ids: number[]) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .in('id', ids)
  
  if (error) throw error
}

// Get single project with full details (for editing)
export async function getProjectById(id: number) {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    // Fetch ALL fields for a single project
    const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.${id}&select=*`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data[0] : data
  } catch (error) {
    console.error('Error in getProjectById:', error)
    throw error
  }
}

// ============================================
// NEWS
// ============================================
export async function getNews() {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    // Get all fields for admin editing
    console.log('🔍 [getNews] Fetching news with auth token...')
    const response = await fetch(`${SUPABASE_URL}/rest/v1/news?select=*&order=id.desc`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    console.log('📡 [getNews] Response:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [getNews] Error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ [getNews] Fetched items:', data.length)
    console.log('📋 [getNews] Status breakdown:', {
      total: data.length,
      published: data.filter((n: any) => n.status === 'published').length,
      draft: data.filter((n: any) => n.status === 'draft').length,
      null: data.filter((n: any) => !n.status).length,
      draftItems: data.filter((n: any) => n.status === 'draft').map((n: any) => ({
        id: n.id,
        title: n.title,
        submittedBy: n.submittedBy
      }))
    })
    return data as Article[]
  } catch (error) {
    console.error('Error in getNews:', error)
    throw error
  }
}

export async function getPublishedNews(limit?: number) {
  try {
    const supabase = getSupabase()
    // Get all fields needed for display
    let query = supabase
      .from('news')
      .select('*')
      .or('status.eq.published,status.is.null')
      .order('id', { ascending: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return (data || []) as Article[]
  } catch (error) {
    console.error('Error in getPublishedNews:', error)
    throw error
  }
}

export async function createNews(article: Omit<Article, 'id'>) {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    console.log('📝 [createNews] Full article data being sent:', {
      title: article.title,
      slug: article.slug,
      category: article.category,
      description: article.description?.substring(0, 100) + '...',
      imageUrl: article.imageUrl,
      tagColor: article.tagColor,
      tags: article.tags,
      publishDate: article.publishDate,
      status: article.status,
      submittedBy: article.submittedBy,
      submittedAt: article.submittedAt
    })
    console.log('🔍 [createNews] Article keys:', Object.keys(article))
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(article)
    })
    
    console.log('📡 [createNews] Response status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [createNews] Error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ [createNews] Response data received:', {
      id: data?.id || (Array.isArray(data) ? data[0]?.id : 'NO ID'),
      title: data?.title || (Array.isArray(data) ? data[0]?.title : 'NO TITLE'),
      category: data?.category || (Array.isArray(data) ? data[0]?.category : 'NO CATEGORY'),
      imageUrl: data?.imageUrl || (Array.isArray(data) ? data[0]?.imageUrl : 'NO IMAGE'),
      tags: data?.tags || (Array.isArray(data) ? data[0]?.tags : 'NO TAGS'),
      status: data?.status || (Array.isArray(data) ? data[0]?.status : 'NO STATUS'),
      allKeys: Object.keys(Array.isArray(data) ? data[0] : data)
    })
    
    return Array.isArray(data) ? data[0] : data
  } catch (error) {
    console.error('💥 [createNews] Exception:', error)
    throw error
  }
}

export async function updateNews(id: number, updates: Partial<Article>) {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    console.log('📝 [updateNews] Updating news ID:', id)
    console.log('📝 [updateNews] Updates object:', {
      title: updates.title,
      category: updates.category,
      description: updates.description?.substring(0, 100),
      imageUrl: updates.imageUrl,
      tagColor: updates.tagColor,
      tags: updates.tags,
      allKeys: Object.keys(updates)
    })
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/news?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(updates)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ [updateNews] Response:', {
      id: data[0]?.id,
      title: data[0]?.title,
      category: data[0]?.category,
      imageUrl: data[0]?.imageUrl,
      allKeys: Object.keys(data[0] || {})
    })
    return Array.isArray(data) ? data[0] : data
  } catch (error) {
    console.error('Error in updateNews:', error)
    throw error
  }
}

export async function deleteNews(ids: number[]) {
  const { error } = await supabase
    .from('news')
    .delete()
    .in('id', ids)
  
  if (error) throw error
}

// Get single news article with full details (for editing)
export async function getNewsById(id: number) {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/news?id=eq.${id}&select=*`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data[0] : data
  } catch (error) {
    console.error('Error in getNewsById:', error)
    throw error
  }
}

// ============================================
// PUBLICATIONS
// ============================================
export async function getPublications() {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    // Get all fields for admin editing
    const response = await fetch(`${SUPABASE_URL}/rest/v1/publications?select=*&order=id.desc`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return data as Article[]
  } catch (error) {
    console.error('Error in getPublications:', error)
    throw error
  }
}

export async function getPublishedPublications(limit?: number) {
  try {
    const supabase = getSupabase()
    // Get all fields needed for display
    let query = supabase
      .from('publications')
      .select('*')
      .or('status.eq.published,status.is.null')
      .order('id', { ascending: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return (data || []) as Article[]
  } catch (error) {
    console.error('Error in getPublishedPublications:', error)
    throw error
  }
}

export async function createPublication(article: Omit<Article, 'id'>) {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/publications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(article)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data[0] : data
  } catch (error) {
    console.error('Error in createPublication:', error)
    throw error
  }
}

export async function updatePublication(id: number, updates: Partial<Article>) {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/publications?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(updates)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data[0] : data
  } catch (error) {
    console.error('Error in updatePublication:', error)
    throw error
  }
}

export async function deletePublications(ids: number[]) {
  const { error } = await supabase
    .from('publications')
    .delete()
    .in('id', ids)
  
  if (error) throw error
}

// Get single publication with full details (for editing)
export async function getPublicationById(id: number) {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/publications?id=eq.${id}&select=*`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data[0] : data
  } catch (error) {
    console.error('Error in getPublicationById:', error)
    throw error
  }
}

export async function incrementDownloadCount(id: number) {
  const { data, error } = await (supabase.rpc as any)('increment_download_count', { publication_id: id })
  
  if (error) throw error
  return data
}

// ============================================
// VIDEOS
// ============================================
export async function getVideos() {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    // Get all fields for admin editing
    const response = await fetch(`${SUPABASE_URL}/rest/v1/videos?select=*&order=id.desc`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return data as Article[]
  } catch (error) {
    console.error('Error in getVideos:', error)
    throw error
  }
}

export async function getPublishedVideos(limit?: number) {
  try {
    const supabase = getSupabase()
    // Get all fields needed for display
    let query = supabase
      .from('videos')
      .select('*')
      .or('status.eq.published,status.is.null')
      .order('id', { ascending: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return (data || []) as Article[]
  } catch (error) {
    console.error('Error in getPublishedVideos:', error)
    throw error
  }
}

export async function createVideo(article: Omit<Article, 'id'>) {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(article)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data[0] : data
  } catch (error) {
    console.error('Error in createVideo:', error)
    throw error
  }
}

export async function updateVideo(id: number, updates: Partial<Article>) {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/videos?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(updates)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data[0] : data
  } catch (error) {
    console.error('Error in updateVideo:', error)
    throw error
  }
}

export async function deleteVideos(ids: number[]) {
  const { error } = await supabase
    .from('videos')
    .delete()
    .in('id', ids)
  
  if (error) throw error
}

// Get single video with full details (for editing)
export async function getVideoById(id: number) {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/videos?id=eq.${id}&select=*`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data[0] : data
  } catch (error) {
    console.error('Error in getVideoById:', error)
    throw error
  }
}

// ============================================
// CATEGORIES
// ============================================

export async function getNewsCategories() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('news_categories')
      .select('name')
      .order('name', { ascending: true })
    
    if (error) throw error
    
    return (data || []).map((c: { name: string }) => c.name)
  } catch (error) {
    console.error('Error in getNewsCategories:', error)
    throw error
  }
}

export async function createNewsCategory(name: string) {
  const { data, error } = await (supabase
    .from('news_categories') as any)
    .insert([{ name }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateNewsCategory(oldName: string, newName: string) {
  const { data, error } = await (supabase
    .from('news_categories') as any)
    .update({ name: newName })
    .eq('name', oldName)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteNewsCategory(name: string) {
  const { error } = await supabase
    .from('news_categories')
    .delete()
    .eq('name', name)
  
  if (error) throw error
}

export async function getPublicationTypes() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('publication_types')
      .select('name')
      .order('name', { ascending: true })
    
    if (error) throw error
    
    return (data || []).map((t: { name: string }) => t.name)
  } catch (error) {
    console.error('Error in getPublicationTypes:', error)
    throw error
  }
}

export async function createPublicationType(name: string) {
  const { data, error } = await (supabase
    .from('publication_types') as any)
    .insert([{ name }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updatePublicationType(oldName: string, newName: string) {
  const { data, error } = await (supabase
    .from('publication_types') as any)
    .update({ name: newName })
    .eq('name', oldName)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deletePublicationType(name: string) {
  const { error } = await supabase
    .from('publication_types')
    .delete()
    .eq('name', name)
  
  if (error) throw error
}

export async function getVideoCategories() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('video_categories')
      .select('name')
      .order('name', { ascending: true })
    
    if (error) throw error
    
    return (data || []).map((c: { name: string }) => c.name)
  } catch (error) {
    console.error('Error in getVideoCategories:', error)
    throw error
  }
}

export async function createVideoCategory(name: string) {
  const { data, error } = await (supabase
    .from('video_categories') as any)
    .insert([{ name }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateVideoCategory(oldName: string, newName: string) {
  const { data, error } = await (supabase
    .from('video_categories') as any)
    .update({ name: newName })
    .eq('name', oldName)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteVideoCategory(name: string) {
  const { error } = await supabase
    .from('video_categories')
    .delete()
    .eq('name', name)
  
  if (error) throw error
}

// ============================================
// USER PROFILE
// ============================================
export async function updateUserProfile(userId: string, profileData: { full_name?: string; avatar_url?: string }) {
  const { data, error } = await (supabase
    .from('profiles') as any)
    .update(profileData)
    .eq('id', userId)
    .select()
  
  if (error) {
    console.error('Profile update error:', error)
    throw error
  }
  
  return data
}

// ============================================
// CHART VISIBILITY
// ============================================
export interface ChartVisibilitySetting {
  id: string
  chart_id: string
  is_visible: boolean
  display_order: number | null
  updated_at: string
  updated_by: string | null
}

export async function getChartVisibilitySettings(): Promise<ChartVisibilitySetting[]> {
  const { data, error } = await supabase
    .from('chart_visibility')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching chart visibility settings:', error)
    throw error
  }
  
  return data as ChartVisibilitySetting[]
}

export async function updateChartVisibility(chartId: string, isVisible: boolean): Promise<void> {
  const { error } = await (supabase
    .from('chart_visibility') as any)
    .update({ is_visible: isVisible })
    .eq('chart_id', chartId)
  
  if (error) {
    console.error('Error updating chart visibility:', error)
    throw error
  }
}

// ============================================
// PAGE CONTENT
// ============================================
export interface PageContent {
  id: number
  page_name: string
  card_id: string
  title: string
  icon_name: string | null
  content: string
  display_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export async function getPageContent(pageName: string): Promise<PageContent[]> {
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page_name', pageName)
    .eq('is_visible', true)
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching page content:', error)
    throw error
  }
  
  return data as PageContent[]
}

export async function updatePageContent(id: number, contentData: Partial<PageContent>): Promise<PageContent> {
  const { data, error } = await (supabase
    .from('page_content') as any)
    .update(contentData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating page content:', error)
    throw error
  }
  
  return data as PageContent
}

export async function createPageContent(contentData: Omit<PageContent, 'id' | 'created_at' | 'updated_at'>): Promise<PageContent> {
  const { data, error } = await (supabase
    .from('page_content') as any)
    .insert([contentData])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating page content:', error)
    throw error
  }
  
  return data as PageContent
}
