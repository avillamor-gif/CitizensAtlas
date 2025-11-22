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

// Get all projects (authenticated users only - for admin panel)
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
    return data as Project[]
  } catch (error) {
    console.error('Error in getProjects:', error)
    throw error
  }
}

export async function getPublishedProjects() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) throw error
    
    // Filter published projects client-side
    const publishedProjects = (data || []).filter((p: any) => p.status === 'published' || p.status === undefined || p.status === null)
    
    return publishedProjects as Project[]
  } catch (error) {
    console.error('Error in getPublishedProjects:', error)
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
    const response = await fetch(`${SUPABASE_URL}/rest/v1/news?select=*&order=id.desc`, {
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
    console.error('Error in getNews:', error)
    throw error
  }
}

export async function getPublishedNews() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) throw error
    
    // Filter published news client-side
    const publishedNews = (data || []).filter((n: any) => n.status === 'published' || n.status === undefined || n.status === null)
    
    return publishedNews as Article[]
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
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data[0] : data
  } catch (error) {
    console.error('Error in createNews:', error)
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

export async function getPublishedPublications() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) throw error
    
    // Filter published publications client-side
    const publishedPublications = (data || []).filter((p: any) => p.status === 'published' || p.status === undefined || p.status === null)
    
    return publishedPublications as Article[]
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

export async function getPublishedVideos() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) throw error
    
    // Filter published videos client-side
    const publishedVideos = (data || []).filter((v: any) => v.status === 'published' || v.status === undefined || v.status === null)
    
    return publishedVideos as Article[]
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
