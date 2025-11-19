import { createClient } from '@/lib/supabase/client'
import { Project, Article } from '@/types/types'

// Get fresh supabase client with current auth state
function getSupabase() {
  return createClient()
}

const supabase = getSupabase()

// ============================================
// PROJECTS
// ============================================

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

// ============================================
// NEWS
// ============================================

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

// ============================================
// PUBLICATIONS
// ============================================

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

// ============================================
// VIDEOS
// ============================================

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

// Keep the rest of the functions for admin operations...
// (This is the minimal version for public data fetching)