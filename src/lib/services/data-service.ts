/**
 * Hybrid Data Service
 * 
 * This service automatically uses Supabase when configured,
 * and falls back to localStorage when Supabase is not available.
 * 
 * Benefits:
 * - Seamless migration path from localStorage to Supabase
 * - No breaking changes to existing code
 * - Works in both development and production
 * - Automatic fallback if Supabase is down
 */

import { Project, Article } from '@/types/types'
import * as supabaseService from './supabase-service'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const configured = !!(
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co'
  )
  
  if (typeof window !== 'undefined') {
    console.log('🔍 Supabase configuration check:', {
      configured,
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL
    })
  }
  
  return configured
}

// ============================================
// PROJECTS
// ============================================
export async function getProjects(): Promise<Project[]> {
  if (isSupabaseConfigured()) {
    try {
      // Try authenticated access first
      const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
      if (authData) {
        // User is logged in, get all projects
        return await supabaseService.getProjects()
      } else {
        // User is not logged in, get only published projects
        console.log('🔓 [Data Service] No auth token, getting published projects only')
        return await supabaseService.getPublishedProjects()
      }
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('atlas_projects')
    return stored ? JSON.parse(stored) : []
  }
  return []
}

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  if (isSupabaseConfigured()) {
    try {
      console.log('🚀 Attempting to create project in Supabase:', { title: project.title })
      const result = await supabaseService.createProject(project)
      console.log('✅ Project created successfully in Supabase:', result.id)
      return result
    } catch (error) {
      console.error('❌ Supabase createProject FAILED:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        fullError: error
      })
    }
  }
  
  // Fallback to localStorage - return project with generated ID
  const projects = await getProjects()
  const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1
  const newProject = { ...project, id: newId } as Project
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('atlas_projects', JSON.stringify([newProject, ...projects]))
  }
  
  return newProject
}

export async function updateProject(id: number, updates: Partial<Project>): Promise<Project> {
  if (isSupabaseConfigured()) {
    // Don't fall back to localStorage - we need to see real errors
    console.log('🔄 [DataService] Attempting Supabase project update:', { id, updates: Object.keys(updates) })
    return await supabaseService.updateProject(id, updates)
  }
  
  // Only use localStorage if Supabase is not configured
  console.warn('⚠️ [DataService] Supabase not configured, using localStorage fallback')
  const projects = await getProjects()
  const updatedProjects = projects.map(p => p.id === id ? { ...p, ...updates } : p)
  const updatedProject = updatedProjects.find(p => p.id === id)!
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('atlas_projects', JSON.stringify(updatedProjects))
  }
  
  return updatedProject
}

export async function deleteProjects(ids: number[]): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseService.deleteProjects(ids)
      return
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  const projects = await getProjects()
  const filtered = projects.filter(p => !ids.includes(p.id))
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('atlas_projects', JSON.stringify(filtered))
  }
}

// ============================================
// NEWS
// ============================================
export async function getNews(): Promise<Article[]> {
  if (isSupabaseConfigured()) {
    try {
      // Try authenticated access first
      const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
      if (authData) {
        // User is logged in, get all news
        return await supabaseService.getNews()
      } else {
        // User is not logged in, get only published news
        console.log('🔓 [Data Service] No auth token, getting published news only')
        return await supabaseService.getPublishedNews()
      }
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('atlas_news')
    return stored ? JSON.parse(stored) : []
  }
  return []
}

export async function createNews(article: Omit<Article, 'id'>): Promise<Article> {
  if (isSupabaseConfigured()) {
    try {
      console.log('🚀 Attempting to create news in Supabase:', { title: article.title, category: article.category })
      const result = await supabaseService.createNews(article)
      console.log('✅ News created successfully in Supabase:', result.id)
      return result
    } catch (error) {
      console.error('❌ Supabase createNews FAILED:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : 'No stack',
        fullError: error
      })
      // Re-throw the error so calling code knows it failed
      throw error
    }
  }
  
  // Fallback to localStorage
  console.log('ℹ️ Supabase not configured, using localStorage fallback')
  const news = await getNews()
  const newId = news.length > 0 ? Math.max(...news.map(n => n.id)) + 1 : 1
  const newArticle = { ...article, id: newId } as Article
  
  if (typeof window !== 'undefined') {
    const updatedNews = [newArticle, ...news]
    // Save minimal metadata to avoid QuotaExceededError
    const minimalNews = updatedNews.slice(0, 5000).map(n => ({
      id: n.id,
      title: n.title,
      status: n.status,
      category: n.category,
      slug: n.slug,
      submittedBy: n.submittedBy,
      submittedAt: n.submittedAt
    }))
    localStorage.setItem('atlas_news', JSON.stringify(minimalNews))
  }
  
  console.log('✅ News saved to localStorage:', newId)
  return newArticle
}

export async function updateNews(id: number, updates: Partial<Article>): Promise<Article> {
  if (isSupabaseConfigured()) {
    // Don't fall back to localStorage - we need to see real errors
    console.log('🔄 [DataService] Attempting Supabase news update:', { id, updates: Object.keys(updates) })
    return await supabaseService.updateNews(id, updates)
  }
  
  // Only use localStorage if Supabase is not configured
  console.warn('⚠️ [DataService] Supabase not configured, using localStorage fallback')
  const news = await getNews()
  const updatedNews = news.map(n => n.id === id ? { ...n, ...updates } : n)
  const updatedArticle = updatedNews.find(n => n.id === id)!
  
  if (typeof window !== 'undefined') {
    // Save minimal metadata
    const minimalNews = updatedNews.slice(0, 5000).map(n => ({
      id: n.id,
      title: n.title,
      status: n.status,
      category: n.category,
      slug: n.slug,
      submittedBy: n.submittedBy,
      submittedAt: n.submittedAt
    }))
    localStorage.setItem('atlas_news', JSON.stringify(minimalNews))
  }
  
  return updatedArticle
}

export async function deleteNews(ids: number[]): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseService.deleteNews(ids)
      return
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  const news = await getNews()
  const filtered = news.filter(n => !ids.includes(n.id))
  
  if (typeof window !== 'undefined') {
    const minimalNews = filtered.slice(0, 5000).map(n => ({
      id: n.id,
      title: n.title,
      status: n.status,
      category: n.category,
      slug: n.slug,
      submittedBy: n.submittedBy,
      submittedAt: n.submittedAt
    }))
    localStorage.setItem('atlas_news', JSON.stringify(minimalNews))
  }
}

// ============================================
// PUBLICATIONS
// ============================================
export async function getPublications(): Promise<Article[]> {
  if (isSupabaseConfigured()) {
    try {
      // Try authenticated access first
      const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
      if (authData) {
        // User is logged in, get all publications
        return await supabaseService.getPublications()
      } else {
        // User is not logged in, get only published publications
        console.log('🔓 [Data Service] No auth token, getting published publications only')
        return await supabaseService.getPublishedPublications()
      }
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('atlas_publications')
    return stored ? JSON.parse(stored) : []
  }
  return []
}

export async function createPublication(article: Omit<Article, 'id'>): Promise<Article> {
  if (isSupabaseConfigured()) {
    try {
      console.log('🚀 Attempting to create publication in Supabase:', { title: article.title })
      const result = await supabaseService.createPublication(article)
      console.log('✅ Publication created successfully in Supabase:', result.id)
      return result
    } catch (error) {
      console.error('❌ Supabase createPublication FAILED:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        fullError: error
      })
      // Re-throw the error so calling code knows it failed
      throw error
    }
  }
  
  // Fallback to localStorage
  console.log('ℹ️ Supabase not configured, using localStorage fallback')
  const publications = await getPublications()
  const newId = publications.length > 0 ? Math.max(...publications.map(p => p.id)) + 1 : 1
  const newArticle = { ...article, id: newId } as Article
  
  if (typeof window !== 'undefined') {
    const updatedPubs = [newArticle, ...publications]
    const minimalPubs = updatedPubs.slice(0, 5000).map(p => ({
      id: p.id,
      title: p.title,
      status: p.status,
      category: p.category,
      slug: p.slug,
      submittedBy: p.submittedBy,
      submittedAt: p.submittedAt
    }))
    localStorage.setItem('atlas_publications', JSON.stringify(minimalPubs))
  }
  
  return newArticle
}

export async function updatePublication(id: number, updates: Partial<Article>): Promise<Article> {
  if (isSupabaseConfigured()) {
    // Don't fall back to localStorage - we need to see real errors
    console.log('🔄 [DataService] Attempting Supabase publication update:', { id, updates: Object.keys(updates) })
    return await supabaseService.updatePublication(id, updates)
  }
  
  // Only use localStorage if Supabase is not configured
  console.warn('⚠️ [DataService] Supabase not configured, using localStorage fallback')
  const publications = await getPublications()
  const updatedPubs = publications.map(p => p.id === id ? { ...p, ...updates } : p)
  const updatedArticle = updatedPubs.find(p => p.id === id)!
  
  if (typeof window !== 'undefined') {
    const minimalPubs = updatedPubs.slice(0, 5000).map(p => ({
      id: p.id,
      title: p.title,
      status: p.status,
      category: p.category,
      slug: p.slug,
      submittedBy: p.submittedBy,
      submittedAt: p.submittedAt
    }))
    localStorage.setItem('atlas_publications', JSON.stringify(minimalPubs))
  }
  
  return updatedArticle
}

export async function deletePublications(ids: number[]): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseService.deletePublications(ids)
      return
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  const publications = await getPublications()
  const filtered = publications.filter(p => !ids.includes(p.id))
  
  if (typeof window !== 'undefined') {
    const minimalPubs = filtered.slice(0, 5000).map(p => ({
      id: p.id,
      title: p.title,
      status: p.status,
      category: p.category,
      slug: p.slug,
      submittedBy: p.submittedBy,
      submittedAt: p.submittedAt
    }))
    localStorage.setItem('atlas_publications', JSON.stringify(minimalPubs))
  }
}

export async function incrementDownloadCount(id: number): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseService.incrementDownloadCount(id)
      return
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  const publications = await getPublications()
  const updated = publications.map(p => 
    p.id === id ? { ...p, downloadCount: (p.downloadCount || 0) + 1 } : p
  )
  
  if (typeof window !== 'undefined') {
    const minimalPubs = updated.slice(0, 5000).map(p => ({
      id: p.id,
      title: p.title,
      status: p.status,
      category: p.category,
      slug: p.slug,
      submittedBy: p.submittedBy,
      submittedAt: p.submittedAt,
      downloadCount: p.downloadCount
    }))
    localStorage.setItem('atlas_publications', JSON.stringify(minimalPubs))
  }
}

// ============================================
// VIDEOS
// ============================================
export async function getVideos(): Promise<Article[]> {
  if (isSupabaseConfigured()) {
    try {
      // Try authenticated access first
      const authData = typeof window !== 'undefined' ? localStorage.getItem('atlas-auth-token') : null
      if (authData) {
        // User is logged in, get all videos
        return await supabaseService.getVideos()
      } else {
        // User is not logged in, get only published videos
        console.log('🔓 [Data Service] No auth token, getting published videos only')
        return await supabaseService.getPublishedVideos()
      }
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('atlas_videos')
    return stored ? JSON.parse(stored) : []
  }
  return []
}

export async function createVideo(article: Omit<Article, 'id'>): Promise<Article> {
  if (isSupabaseConfigured()) {
    try {
      console.log('🚀 Attempting to create video in Supabase:', { title: article.title })
      const result = await supabaseService.createVideo(article)
      console.log('✅ Video created successfully in Supabase:', result.id)
      return result
    } catch (error) {
      console.error('❌ Supabase createVideo FAILED:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        fullError: error
      })
      // Re-throw the error so calling code knows it failed
      throw error
    }
  }
  
  // Fallback to localStorage
  console.log('ℹ️ Supabase not configured, using localStorage fallback')
  const videos = await getVideos()
  const newId = videos.length > 0 ? Math.max(...videos.map(v => v.id)) + 1 : 1
  const newArticle = { ...article, id: newId } as Article
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('atlas_videos', JSON.stringify([newArticle, ...videos]))
  }
  
  console.log('✅ Video saved to localStorage:', newId)
  return newArticle
}

export async function updateVideo(id: number, updates: Partial<Article>): Promise<Article> {
  if (isSupabaseConfigured()) {
    // Don't fall back to localStorage - we need to see real errors
    console.log('🔄 [DataService] Attempting Supabase video update:', { id, updates: Object.keys(updates) })
    return await supabaseService.updateVideo(id, updates)
  }
  
  // Only use localStorage if Supabase is not configured
  console.warn('⚠️ [DataService] Supabase not configured, using localStorage fallback')
  const videos = await getVideos()
  const updatedVideos = videos.map(v => v.id === id ? { ...v, ...updates } : v)
  const updatedArticle = updatedVideos.find(v => v.id === id)!
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('atlas_videos', JSON.stringify(updatedVideos))
  }
  
  return updatedArticle
}

export async function deleteVideos(ids: number[]): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseService.deleteVideos(ids)
      return
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  const videos = await getVideos()
  const filtered = videos.filter(v => !ids.includes(v.id))
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('atlas_videos', JSON.stringify(filtered))
  }
}

// ============================================
// CATEGORIES
// ============================================
export async function getNewsCategories(): Promise<string[]> {
  if (isSupabaseConfigured()) {
    try {
      return await supabaseService.getNewsCategories()
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('atlas_newsCategories')
    return stored ? JSON.parse(stored) : []
  }
  return []
}

export async function createNewsCategory(name: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseService.createNewsCategory(name)
      return
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  const categories = await getNewsCategories()
  if (!categories.includes(name)) {
    const updated = [...categories, name].sort()
    if (typeof window !== 'undefined') {
      localStorage.setItem('atlas_newsCategories', JSON.stringify(updated))
    }
  }
}

export async function updateNewsCategory(oldName: string, newName: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseService.updateNewsCategory(oldName, newName)
      return
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  const categories = await getNewsCategories()
  const updated = categories.map(c => c === oldName ? newName : c).sort()
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('atlas_newsCategories', JSON.stringify(updated))
  }
}

export async function deleteNewsCategory(name: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseService.deleteNewsCategory(name)
      return
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  const categories = await getNewsCategories()
  const filtered = categories.filter(c => c !== name)
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('atlas_newsCategories', JSON.stringify(filtered))
  }
}

export async function getPublicationTypes(): Promise<string[]> {
  if (isSupabaseConfigured()) {
    try {
      return await supabaseService.getPublicationTypes()
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('atlas_publicationTypes')
    return stored ? JSON.parse(stored) : []
  }
  return []
}

export async function createPublicationType(name: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseService.createPublicationType(name)
      return
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  const types = await getPublicationTypes()
  if (!types.includes(name)) {
    const updated = [...types, name].sort()
    if (typeof window !== 'undefined') {
      localStorage.setItem('atlas_publicationTypes', JSON.stringify(updated))
    }
  }
}

export async function updatePublicationType(oldName: string, newName: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseService.updatePublicationType(oldName, newName)
      return
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  const types = await getPublicationTypes()
  const updated = types.map(t => t === oldName ? newName : t).sort()
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('atlas_publicationTypes', JSON.stringify(updated))
  }
}

export async function deletePublicationType(name: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseService.deletePublicationType(name)
      return
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  const types = await getPublicationTypes()
  const filtered = types.filter(t => t !== name)
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('atlas_publicationTypes', JSON.stringify(filtered))
  }
}

export async function getVideoCategories(): Promise<string[]> {
  if (isSupabaseConfigured()) {
    try {
      return await supabaseService.getVideoCategories()
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('atlas_videoCategories')
    return stored ? JSON.parse(stored) : []
  }
  return []
}

export async function createVideoCategory(name: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseService.createVideoCategory(name)
      return
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  const categories = await getVideoCategories()
  if (!categories.includes(name)) {
    const updated = [...categories, name].sort()
    if (typeof window !== 'undefined') {
      localStorage.setItem('atlas_videoCategories', JSON.stringify(updated))
    }
  }
}

export async function updateVideoCategory(oldName: string, newName: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseService.updateVideoCategory(oldName, newName)
      return
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  const categories = await getVideoCategories()
  const updated = categories.map(c => c === oldName ? newName : c).sort()
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('atlas_videoCategories', JSON.stringify(updated))
  }
}

export async function deleteVideoCategory(name: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseService.deleteVideoCategory(name)
      return
    } catch (error) {
      console.warn('Supabase error, falling back to localStorage:', error)
    }
  }
  
  // Fallback to localStorage
  const categories = await getVideoCategories()
  const filtered = categories.filter(c => c !== name)
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('atlas_videoCategories', JSON.stringify(filtered))
  }
}

// ============================================
// USER PROFILE
// ============================================
export async function updateUserProfile(userId: string, profileData: { full_name?: string; avatar_url?: string }): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseService.updateUserProfile(userId, profileData)
      return
    } catch (error) {
      console.warn('Supabase error updating profile:', error)
      throw error
    }
  }
  
  throw new Error('Profile updates require Supabase configuration')
}
