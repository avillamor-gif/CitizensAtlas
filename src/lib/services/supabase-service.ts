import { createClient, resetClient } from '@/lib/supabase/client'
import { Project, Article } from '@/types/types'

// Constants for direct REST API calls
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Force reset client on module reload (development only)
if (typeof window !== 'undefined') {
  console.log('🔄 [Supabase Service] Module loaded, resetting client to apply new config')
  resetClient()
}

// Get fresh supabase client with current auth state
function getSupabase() {
  return createClient()
}

const supabase = getSupabase()

// ============================================
// PROJECTS
// ============================================
export async function getProjects() {
  console.log('📖 [Supabase] Getting projects...')
  
  // Use localStorage auth + direct REST API (consistent with working create/update functions)
  const authData = localStorage.getItem('atlas-auth-token')
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
      console.error('❌ [Supabase] HTTP error getting projects:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ [Supabase] Projects loaded successfully:', data.length, 'projects')
    
    return data as Project[]
  } catch (error) {
    console.error('❌ [Supabase] Error in getProjects:', error)
    throw error
  }
}

export async function getPublishedProjects() {
  console.log('📖 [Supabase] Getting published projects (public access)...')
  
  try {
    // Use direct REST API without authentication for public data
    const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*&eq=status.published&order=id.desc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [Supabase] HTTP error getting published projects:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ [Supabase] Published projects loaded successfully:', data.length, 'projects')
    
    return data as Project[]
  } catch (error) {
    console.error('❌ [Supabase] Error in getPublishedProjects:', error)
    throw error
  }
}

export async function createProject(project: Omit<Project, 'id'>) {
  console.log('📝 [Supabase] Creating project:', { 
    title: project.title, 
    status: project.status 
  })
  
  // First, let's check what IDs already exist in the database
  try {
    const existingResponse = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=id&order=id.desc&limit=5`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })
    if (existingResponse.ok) {
      const existingIds = await existingResponse.json()
      console.log('🔍 [Supabase] Existing project IDs:', existingIds.map((p: any) => p.id))
    }
  } catch (e) {
    console.log('⚠️ [Supabase] Could not check existing IDs:', e)
  }
  
  // Use localStorage auth + direct REST API (like working Video function)
  const authData = localStorage.getItem('atlas-auth-token')
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
  console.log('🔧 [Supabase] Removed ID field, sending clean data:', JSON.stringify(projectDataWithoutId, null, 2))
  console.log('🔧 [Supabase] Original data had ID?', 'id' in (project as any))
  
  try {
    // TEMPORARY WORKAROUND: Use UPSERT to handle sequence conflicts
    const response = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=representation,resolution=merge-duplicates'
      },
      body: JSON.stringify(projectDataWithoutId)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [Supabase] HTTP error creating project:', response.status, errorText)
      
      // If it's a sequence conflict, try manual ID assignment
      if (response.status === 409 && errorText.includes('duplicate key')) {
        console.log('🔧 [Supabase] Sequence conflict detected, trying manual ID assignment...')
        
        // Get the highest ID and add 1
        const maxIdResponse = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=id&order=id.desc&limit=1`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'apikey': SUPABASE_ANON_KEY
          }
        })
        
        if (maxIdResponse.ok) {
          const maxIdData = await maxIdResponse.json()
          const nextId = (maxIdData[0]?.id || 0) + 1
          console.log('🔧 [Supabase] Assigning manual ID:', nextId)
          
          const retryResponse = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
              'apikey': SUPABASE_ANON_KEY,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({ ...projectDataWithoutId, id: nextId })
          })
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json()
            const createdProject = Array.isArray(retryData) ? retryData[0] : retryData
            console.log('✅ [Supabase] Project created with manual ID:', { 
              id: createdProject.id, 
              title: createdProject.title 
            })
            return createdProject as Project
          } else {
            const retryErrorText = await retryResponse.text()
            console.error('❌ [Supabase] Manual ID assignment also failed:', retryResponse.status, retryErrorText)
            throw new Error(`Manual ID assignment failed: HTTP ${retryResponse.status}: ${retryErrorText}`)
          }
        }
      }
      
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    const createdProject = Array.isArray(data) ? data[0] : data
    
    console.log('✅ [Supabase] Project created successfully:', { 
      id: createdProject.id, 
      title: createdProject.title 
    })
    
    return createdProject as Project
  } catch (error) {
    console.error('❌ [Supabase] Error in createProject:', error)
    throw error
  }
}

export async function updateProject(id: number, updates: Partial<Project>) {
  console.log('📝 [Supabase] Updating project:', { id, title: updates.title })
  console.log('🔧 [Supabase] Environment check:', {
    hasURL: !!SUPABASE_URL,
    hasKey: !!SUPABASE_ANON_KEY,
    url: SUPABASE_URL?.substring(0, 30) + '...',
    keyPrefix: SUPABASE_ANON_KEY?.substring(0, 20) + '...'
  })
  
  // Use localStorage auth + direct REST API (like working create functions)
  const authData = localStorage.getItem('atlas-auth-token')
  console.log('🔍 [Supabase] Auth data check:', {
    hasAuthData: !!authData,
    authDataLength: authData?.length || 0
  })
  
  if (!authData) {
    console.error('❌ [Supabase] No authentication token found in localStorage')
    throw new Error('No authentication token found')
  }
  
  let parsedAuth
  try {
    parsedAuth = JSON.parse(authData)
    console.log('✅ [Supabase] Auth data parsed:', {
      hasAccessToken: !!parsedAuth.access_token,
      tokenLength: parsedAuth.access_token?.length || 0,
      expiresAt: parsedAuth.expires_at,
      currentTime: Math.floor(Date.now() / 1000),
      isExpired: parsedAuth.expires_at ? Math.floor(Date.now() / 1000) > parsedAuth.expires_at : 'unknown'
    })
  } catch (e) {
    console.error('❌ [Supabase] Failed to parse auth data:', e)
    throw new Error('Invalid authentication data')
  }
  
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    console.error('❌ [Supabase] No access token found in stored auth data')
    throw new Error('No access token found in stored auth data')
  }
  
  // Check if this is a contributor edit - if so, reset to draft for re-approval
  try {
    const currentUserResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (currentUserResponse.ok) {
      const userData = await currentUserResponse.json()
      const userEmail = userData.email
      
      // Get user role from profiles table
      const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=role&id=eq.${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'apikey': SUPABASE_ANON_KEY
        }
      })
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        const userRole = profileData[0]?.role
        
        console.log('🔍 [Supabase] User role for update:', userRole)
        
        // If contributor is editing, reset to draft for re-approval
        if (userRole === 'contributor') {
          updates = { ...updates, status: 'draft' as const }
          console.log('🔄 [Supabase] Contributor edit detected - resetting status to draft for re-approval')
        }
      }
    }
  } catch (e) {
    console.log('⚠️ [Supabase] Could not check user role, proceeding with update:', e)
  }
  
  console.log('🔧 [Supabase] Update data:', JSON.stringify(updates, null, 2))
  
  try {
    const url = `${SUPABASE_URL}/rest/v1/projects?id=eq.${id}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'apikey': SUPABASE_ANON_KEY,
      'Prefer': 'return=representation'
    }
    const body = JSON.stringify(updates)
    
    console.log('🌐 [Supabase] Making API call:', {
      url,
      method: 'PATCH',
      headersPresent: {
        contentType: !!headers['Content-Type'],
        authorization: !!headers['Authorization'],
        apikey: !!headers['apikey'],
        prefer: !!headers['Prefer']
      },
      bodyLength: body.length
    })
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body
    })
    
    console.log('📡 [Supabase] API response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [Supabase] HTTP error updating project:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    const updatedProject = Array.isArray(data) ? data[0] : data
    
    console.log('✅ [Supabase] Project updated successfully:', { 
      id: updatedProject?.id, 
      title: updatedProject?.title,
      status: updatedProject?.status,
      dataReceived: !!data,
      isArray: Array.isArray(data),
      arrayLength: Array.isArray(data) ? data.length : 'N/A'
    })
    
    return updatedProject as Project
  } catch (error) {
    console.error('❌ [Supabase] Error in updateProject:', error)
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
  console.log('📖 [Supabase] Getting news...')
  
  // Use localStorage auth + direct REST API (consistent with working create/update functions)
  const authData = localStorage.getItem('atlas-auth-token')
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
      console.error('❌ [Supabase] HTTP error getting news:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ [Supabase] News loaded successfully:', data.length, 'articles')
    
    return data as Article[]
  } catch (error) {
    console.error('❌ [Supabase] Error in getNews:', error)
    throw error
  }
}

export async function getPublishedNews() {
  console.log('📖 [Supabase] Getting published news (public access)...')
  
  try {
    // Use direct REST API without authentication for public data
    const response = await fetch(`${SUPABASE_URL}/rest/v1/news?select=*&eq=status.published&order=id.desc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [Supabase] HTTP error getting published news:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ [Supabase] Published news loaded successfully:', data.length, 'articles')
    
    return data as Article[]
  } catch (error) {
    console.error('❌ [Supabase] Error in getPublishedNews:', error)
    throw error
  }
}

export async function createNews(article: Omit<Article, 'id'>) {
  console.log('📝 [Supabase] Creating news:', { 
    title: article.title, 
    status: article.status 
  })
  
  console.log('🔍 [Supabase] Full news data being inserted:', JSON.stringify(article, null, 2))
  
  // Increase timeout to 30 seconds for database operations
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      console.error('❌ [Supabase] News insert timed out after 30 seconds!')
      reject(new Error('Supabase news insert timeout after 30 seconds'))
    }, 30000)
  })
  
  const insertPromise = (async () => {
    console.log('🔄 [Supabase] Starting news insert into database...')
    console.log('⚡ [Supabase] Using direct REST API call (bypassing Supabase SDK)')
    
    const startTime = Date.now()
    
    // Get auth session using SDK
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      throw new Error('No auth session found')
    }
    
    const accessToken = session.access_token
    console.log('✅ [Supabase] Retrieved access token from session')
    
    const supabaseUrl = 'https://srsjynjccivtjvordrlc.supabase.co'
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2p5bmpjY2l2dGp2b3JkcmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMDE3NjUsImV4cCI6MjA3Mzc3Nzc2NX0.YOyYebTJSgq0bEcBQDXsNCiK6WPvB8lViSKtquzkdGE'
    
    console.log('🌐 [Supabase] Making direct fetch call to:', `${supabaseUrl}/rest/v1/news`)
    
    const response = await fetch(`${supabaseUrl}/rest/v1/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${accessToken}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(article)
    })
    
    const duration = Date.now() - startTime
    console.log(`🔍 [Supabase] Response received after ${duration}ms:`, { 
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      console.error('❌ [Supabase] Error creating news:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(`Failed to create news: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('✅ [Supabase] News created successfully:', data[0]?.id)
    
    return data[0]
  })()
  
  try {
    const data = await Promise.race([insertPromise, timeoutPromise]) as Article
    console.log('✅ [Supabase] News created successfully:', { id: data.id, title: data.title })
    return data
  } catch (error) {
    console.error('❌ [Supabase] createNews failed:', error)
    throw error
  }
}

export async function updateNews(id: number, updates: Partial<Article>) {
  console.log('📝 [Supabase] Updating news:', { id, title: updates.title })
  
  // Use localStorage auth + direct REST API (like working create functions)
  const authData = localStorage.getItem('atlas-auth-token')
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  // Check if this is a contributor edit - if so, reset to draft for re-approval
  try {
    const currentUserResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (currentUserResponse.ok) {
      const userData = await currentUserResponse.json()
      
      // Get user role from profiles table
      const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=role&id=eq.${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'apikey': SUPABASE_ANON_KEY
        }
      })
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        const userRole = profileData[0]?.role
        
        console.log('🔍 [Supabase] User role for update:', userRole)
        
        // If contributor is editing, reset to draft for re-approval
        if (userRole === 'contributor') {
          updates = { ...updates, status: 'draft' as const }
          console.log('🔄 [Supabase] Contributor edit detected - resetting status to draft for re-approval')
        }
      }
    }
  } catch (e) {
    console.log('⚠️ [Supabase] Could not check user role, proceeding with update:', e)
  }
  
  console.log('🔧 [Supabase] Update data:', JSON.stringify(updates, null, 2))
  
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
      console.error('❌ [Supabase] HTTP error updating news:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    const updatedNews = Array.isArray(data) ? data[0] : data
    
    console.log('✅ [Supabase] News updated successfully:', { 
      id: updatedNews.id, 
      title: updatedNews.title,
      status: updatedNews.status
    })
    
    return updatedNews as Article
  } catch (error) {
    console.error('❌ [Supabase] Error in updateNews:', error)
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
  console.log('📖 [Supabase] Getting publications...')
  
  // Use localStorage auth + direct REST API (consistent with working create/update functions)
  const authData = localStorage.getItem('atlas-auth-token')
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
      console.error('❌ [Supabase] HTTP error getting publications:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ [Supabase] Publications loaded successfully:', data.length, 'publications')
    
    return data as Article[]
  } catch (error) {
    console.error('❌ [Supabase] Error in getPublications:', error)
    throw error
  }
}

export async function getPublishedPublications() {
  console.log('📖 [Supabase] Getting published publications (public access)...')
  
  try {
    // Use direct REST API without authentication for public data
    const response = await fetch(`${SUPABASE_URL}/rest/v1/publications?select=*&eq=status.published&order=id.desc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [Supabase] HTTP error getting published publications:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ [Supabase] Published publications loaded successfully:', data.length, 'publications')
    
    return data as Article[]
  } catch (error) {
    console.error('❌ [Supabase] Error in getPublishedPublications:', error)
    throw error
  }
}

export async function createPublication(article: Omit<Article, 'id'>) {
  console.log('📝 [Supabase] Creating publication:', { 
    title: article.title, 
    status: article.status 
  })
  
  // First, let's check what IDs already exist in the database
  try {
    const existingResponse = await fetch(`${SUPABASE_URL}/rest/v1/publications?select=id&order=id.desc&limit=5`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })
    if (existingResponse.ok) {
      const existingIds = await existingResponse.json()
      console.log('🔍 [Supabase] Existing publication IDs:', existingIds.map((p: any) => p.id))
    }
  } catch (e) {
    console.log('⚠️ [Supabase] Could not check existing IDs:', e)
  }
  
  // Use localStorage auth + direct REST API (like working Project function)
  const authData = localStorage.getItem('atlas-auth-token')
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  // Remove any ID field to prevent conflicts
  const { id, ...articleDataWithoutId } = article as any
  console.log('🔧 [Supabase] Removed ID field, sending clean data:', JSON.stringify(articleDataWithoutId, null, 2))
  console.log('🔧 [Supabase] Original data had ID?', 'id' in (article as any))
  
  try {
    // TEMPORARY WORKAROUND: Use sequence conflict handling (same as Projects)
    const response = await fetch(`${SUPABASE_URL}/rest/v1/publications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=representation,resolution=merge-duplicates'
      },
      body: JSON.stringify(articleDataWithoutId)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [Supabase] HTTP error creating publication:', response.status, errorText)
      
      // If it's a sequence conflict, try manual ID assignment
      if (response.status === 409 && errorText.includes('duplicate key')) {
        console.log('🔧 [Supabase] Sequence conflict detected, trying manual ID assignment...')
        
        // Get the highest ID and add 1
        const maxIdResponse = await fetch(`${SUPABASE_URL}/rest/v1/publications?select=id&order=id.desc&limit=1`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'apikey': SUPABASE_ANON_KEY
          }
        })
        
        if (maxIdResponse.ok) {
          const maxIdData = await maxIdResponse.json()
          const nextId = (maxIdData[0]?.id || 0) + 1
          console.log('🔧 [Supabase] Assigning manual ID:', nextId)
          
          const retryResponse = await fetch(`${SUPABASE_URL}/rest/v1/publications`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
              'apikey': SUPABASE_ANON_KEY,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({ ...articleDataWithoutId, id: nextId })
          })
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json()
            const createdPublication = Array.isArray(retryData) ? retryData[0] : retryData
            console.log('✅ [Supabase] Publication created with manual ID:', { 
              id: createdPublication.id, 
              title: createdPublication.title 
            })
            return createdPublication as Article
          } else {
            const retryErrorText = await retryResponse.text()
            console.error('❌ [Supabase] Manual ID assignment also failed:', retryResponse.status, retryErrorText)
            throw new Error(`Manual ID assignment failed: HTTP ${retryResponse.status}: ${retryErrorText}`)
          }
        }
      }
      
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    const createdPublication = Array.isArray(data) ? data[0] : data
    
    console.log('✅ [Supabase] Publication created successfully:', { 
      id: createdPublication.id, 
      title: createdPublication.title 
    })
    
    return createdPublication as Article
  } catch (error) {
    console.error('❌ [Supabase] Error in createPublication:', error)
    throw error
  }
}

export async function updatePublication(id: number, updates: Partial<Article>) {
  console.log('📝 [Supabase] Updating publication:', { id, title: updates.title })
  
  // Use localStorage auth + direct REST API (like working create functions)
  const authData = localStorage.getItem('atlas-auth-token')
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  // Check if this is a contributor edit - if so, reset to draft for re-approval
  try {
    const currentUserResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (currentUserResponse.ok) {
      const userData = await currentUserResponse.json()
      
      // Get user role from profiles table
      const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=role&id=eq.${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'apikey': SUPABASE_ANON_KEY
        }
      })
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        const userRole = profileData[0]?.role
        
        console.log('🔍 [Supabase] User role for update:', userRole)
        
        // If contributor is editing, reset to draft for re-approval
        if (userRole === 'contributor') {
          updates = { ...updates, status: 'draft' as const }
          console.log('🔄 [Supabase] Contributor edit detected - resetting status to draft for re-approval')
        }
      }
    }
  } catch (e) {
    console.log('⚠️ [Supabase] Could not check user role, proceeding with update:', e)
  }
  
  console.log('🔧 [Supabase] Update data:', JSON.stringify(updates, null, 2))
  
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
      console.error('❌ [Supabase] HTTP error updating publication:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    const updatedPublication = Array.isArray(data) ? data[0] : data
    
    console.log('✅ [Supabase] Publication updated successfully:', { 
      id: updatedPublication.id, 
      title: updatedPublication.title,
      status: updatedPublication.status
    })
    
    return updatedPublication as Article
  } catch (error) {
    console.error('❌ [Supabase] Error in updatePublication:', error)
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
  console.log('📖 [Supabase] Getting videos...')
  
  // Use localStorage auth + direct REST API (consistent with working create/update functions)
  const authData = localStorage.getItem('atlas-auth-token')
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
      console.error('❌ [Supabase] HTTP error getting videos:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ [Supabase] Videos loaded successfully:', data.length, 'videos')
    
    return data as Article[]
  } catch (error) {
    console.error('❌ [Supabase] Error in getVideos:', error)
    throw error
  }
}

export async function getPublishedVideos() {
  console.log('📖 [Supabase] Getting published videos (public access)...')
  
  try {
    // Use direct REST API without authentication for public data
    const response = await fetch(`${SUPABASE_URL}/rest/v1/videos?select=*&eq=status.published&order=id.desc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [Supabase] HTTP error getting published videos:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ [Supabase] Published videos loaded successfully:', data.length, 'videos')
    
    return data as Article[]
  } catch (error) {
    console.error('❌ [Supabase] Error in getPublishedVideos:', error)
    throw error
  }
}

export async function createVideo(article: Omit<Article, 'id'>) {
  console.log('📝 [Supabase] Creating video:', { 
    title: article.title, 
    status: article.status 
  })
  
  console.log('🔍 [Supabase] Full video data being inserted:', JSON.stringify(article, null, 2))
  
  // Increase timeout to 30 seconds for database operations
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      console.error('❌ [Supabase] Video insert timed out after 30 seconds!')
      reject(new Error('Supabase video insert timeout after 30 seconds'))
    }, 30000)
  })
  
  const insertPromise = (async () => {
    console.log('🔄 [Supabase] Starting video insert into database...')
    console.log('⚡ [Supabase] Using direct REST API call (bypassing Supabase SDK)')
    
    const startTime = Date.now()
    
    // BYPASS problematic session call - use direct localStorage approach like News function
    console.log('� [Supabase] Bypassing problematic session call, using direct token retrieval')
    
    // Get token directly from localStorage (same as working News function)
    const authData = localStorage.getItem('atlas-auth-token')
    if (!authData) {
      throw new Error('No auth token found in localStorage')
    }
    
    let accessToken: string
    try {
      const parsedAuth = JSON.parse(authData)
      accessToken = parsedAuth.access_token
      console.log('✅ [Supabase] Retrieved access token from localStorage')
    } catch (error) {
      console.error('❌ [Supabase] Failed to parse auth token:', error)
      throw new Error('Invalid auth token format')
    }
    
    if (!accessToken) {
      throw new Error('No access token found in auth data')
    }
    
    const supabaseUrl = 'https://srsjynjccivtjvordrlc.supabase.co'
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2p5bmpjY2l2dGp2b3JkcmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMDE3NjUsImV4cCI6MjA3Mzc3Nzc2NX0.YOyYebTJSgq0bEcBQDXsNCiK6WPvB8lViSKtquzkdGE'
    
    console.log('🌐 [Supabase] Making direct fetch call to:', `${supabaseUrl}/rest/v1/videos`)
    
    const response = await fetch(`${supabaseUrl}/rest/v1/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${accessToken}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(article)
    })
    
    const duration = Date.now() - startTime
    console.log(`🔍 [Supabase] Response received after ${duration}ms:`, { 
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      console.error('❌ [Supabase] Error creating video:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(`Failed to create video: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('✅ [Supabase] Video created successfully:', data[0]?.id)
    
    return data[0]
  })()
  
  try {
    const data = await Promise.race([insertPromise, timeoutPromise]) as Article
    console.log('✅ [Supabase] Video created successfully:', { 
      id: data.id, 
      title: data.title,
      status: data.status 
    })
    return data
  } catch (error) {
    console.error('❌ [Supabase] createVideo failed:', error)
    throw error
  }
}

export async function updateVideo(id: number, updates: Partial<Article>) {
  console.log('📝 [Supabase] Updating video:', { id, title: updates.title })
  
  // Use localStorage auth + direct REST API (like working create functions)
  const authData = localStorage.getItem('atlas-auth-token')
  if (!authData) {
    throw new Error('No authentication token found')
  }
  
  const parsedAuth = JSON.parse(authData)
  const accessToken = parsedAuth.access_token
  
  if (!accessToken) {
    throw new Error('No access token found in stored auth data')
  }
  
  // Check if this is a contributor edit - if so, reset to draft for re-approval
  try {
    const currentUserResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (currentUserResponse.ok) {
      const userData = await currentUserResponse.json()
      
      // Get user role from profiles table
      const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=role&id=eq.${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'apikey': SUPABASE_ANON_KEY
        }
      })
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        const userRole = profileData[0]?.role
        
        console.log('🔍 [Supabase] User role for update:', userRole)
        
        // If contributor is editing, reset to draft for re-approval
        if (userRole === 'contributor') {
          updates = { ...updates, status: 'draft' as const }
          console.log('🔄 [Supabase] Contributor edit detected - resetting status to draft for re-approval')
        }
      }
    }
  } catch (e) {
    console.log('⚠️ [Supabase] Could not check user role, proceeding with update:', e)
  }
  
  console.log('🔧 [Supabase] Update data:', JSON.stringify(updates, null, 2))
  
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
      console.error('❌ [Supabase] HTTP error updating video:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    const updatedVideo = Array.isArray(data) ? data[0] : data
    
    console.log('✅ [Supabase] Video updated successfully:', { 
      id: updatedVideo.id, 
      title: updatedVideo.title,
      status: updatedVideo.status
    })
    
    return updatedVideo as Article
  } catch (error) {
    console.error('❌ [Supabase] Error in updateVideo:', error)
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
  console.log('📖 [Supabase] Getting news categories (public access)...')
  
  try {
    // Use direct REST API without authentication for public data
    const response = await fetch(`${SUPABASE_URL}/rest/v1/news_categories?select=name&order=name.asc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [Supabase] HTTP error getting news categories:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ [Supabase] News categories loaded successfully:', data.length, 'categories')
    
    return data.map((c: { name: string }) => c.name)
  } catch (error) {
    console.error('❌ [Supabase] Error in getNewsCategories:', error)
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
  console.log('📖 [Supabase] Getting publication types (public access)...')
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/publication_types?select=name&order=name.asc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [Supabase] HTTP error getting publication types:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ [Supabase] Publication types loaded successfully:', data.length, 'types')
    return data.map((t: { name: string }) => t.name)
  } catch (error) {
    console.error('❌ [Supabase] Error in getPublicationTypes:', error)
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
  console.log('📖 [Supabase] Getting video categories (public access)...')
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/video_categories?select=name&order=name.asc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [Supabase] HTTP error getting video categories:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ [Supabase] Video categories loaded successfully:', data.length, 'categories')
    return data.map((c: { name: string }) => c.name)
  } catch (error) {
    console.error('❌ [Supabase] Error in getVideoCategories:', error)
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
  console.log('🔄 Updating profile for user:', userId, 'with data:', profileData)
  
  const { data, error } = await (supabase
    .from('profiles') as any)
    .update(profileData)
    .eq('id', userId)
    .select()
  
  if (error) {
    console.error('❌ Profile update error:', error)
    throw error
  }
  
  console.log('✅ Profile updated successfully:', data)
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
  console.log('[DB] Fetching chart visibility settings...')
  const { data, error } = await supabase
    .from('chart_visibility')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('[DB] Error fetching chart visibility settings:', error)
    throw error
  }
  
  console.log('[DB] Chart visibility settings loaded:', data)
  return data as ChartVisibilitySetting[]
}

export async function updateChartVisibility(chartId: string, isVisible: boolean): Promise<void> {
  console.log(`[DB] Updating chart visibility: ${chartId} = ${isVisible}`)
  
  const { error } = await (supabase
    .from('chart_visibility') as any)
    .update({ is_visible: isVisible })
    .eq('chart_id', chartId)
  
  if (error) {
    console.error('[DB] Error updating chart visibility:', error)
    throw error
  }
  
  console.log(`[DB] Successfully updated chart visibility: ${chartId} = ${isVisible}`)
}
