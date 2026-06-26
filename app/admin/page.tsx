'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminDashboard } from '@/components/features/admin'
import { useAuth } from '@/contexts/AuthContext'
import { Project, Article, ProjectBrief } from '@/types/types'
import * as DataService from '@/lib/services/data-service'

export default function Admin() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [projectBriefs, setProjectBriefs] = useState<ProjectBrief[]>([])
  const [news, setNews] = useState<Article[]>([])
  const [publications, setPublications] = useState<Article[]>([])
  const [videos, setVideos] = useState<Article[]>([])
  const [newsCategories, setNewsCategories] = useState<string[]>([])
  const [publicationTypes, setPublicationTypes] = useState<string[]>([])
  const [publicationCategories, setPublicationCategories] = useState<string[]>([])
  const [videoCategories, setVideoCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  
  // Track what data has been loaded to prevent redundant fetches
  const [loadedData, setLoadedData] = useState({
    projects: false,
    projectBriefs: false,
    news: false,
    publications: false,
    videos: false,
    categories: false
  })

  // Load data when component mounts or user changes
  useEffect(() => {
    if (!authLoading) {
      // Only load categories initially - they're small and always needed
      loadCategories()
    }
  }, [authLoading, user])

  const loadCategories = async (forceReload = false) => {
    if (loadedData.categories && !forceReload) return // Already loaded
    
    try {
      console.log('📥 Admin: Loading categories...')
      setLoading(true)
      setLoadError(null)
      
      const [newsCatsData, pubTypesData, pubCategoriesData, videoCatsData] = await Promise.all([
        DataService.getNewsCategories(),
        DataService.getPublicationTypes(),
        DataService.getPublicationCategories(),
        DataService.getVideoCategories()
      ])

      setNewsCategories(newsCatsData)
      setPublicationTypes(pubTypesData)
      setPublicationCategories(pubCategoriesData)
      setVideoCategories(videoCatsData)
      setLoadedData(prev => ({ ...prev, categories: true }))
      
      console.log('✅ Admin: Categories loaded', {
        newsCategories: newsCatsData.length,
        publicationTypes: pubTypesData.length,
        publicationCategories: pubCategoriesData.length,
        videoCategories: videoCatsData.length
      })
    } catch (error) {
      console.error('❌ Admin: Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load projects on-demand
  const loadProjects = async (forceReload = false) => {
    if (loadedData.projects && !forceReload) return // Already loaded
    
    try {
      console.log('📥 Admin: Loading projects... (forceReload:', forceReload, ')')
      const projectsData = await DataService.getProjects()
      console.log('📊 Admin: Received', projectsData.length, 'projects from data service')
      setProjects(projectsData)
      setLoadedData(prev => ({ ...prev, projects: true }))
      console.log('✅ Admin: Projects state updated with', projectsData.length, 'projects')
    } catch (error) {
      console.error('❌ Admin: Error loading projects:', error)
      throw error
    }
  }

  // Load project briefs on-demand
  const loadProjectBriefs = async (forceReload = false) => {
    if (loadedData.projectBriefs && !forceReload) {
      console.log('⏭️  Admin: Skipping project briefs load (already loaded, forceReload:', forceReload, ')')
      return // Already loaded
    }
    
    try {
      console.log('📥 Admin: Loading project briefs... (forceReload:', forceReload, ')')
      const briefsData = await DataService.getProjectBriefs()
      console.log('📊 Admin: Received', briefsData.length, 'project briefs from data service')
      console.log('📋 Admin: Brief IDs:', briefsData.map(b => b.id))
      console.log('📋 Admin: Brief names:', briefsData.map(b => b.project_name))
      setProjectBriefs(briefsData)
      setLoadedData(prev => ({ ...prev, projectBriefs: true }))
      console.log('✅ Admin: Project briefs state updated with', briefsData.length, 'briefs')
    } catch (error) {
      console.error('❌ Admin: Error loading project briefs:', error)
      throw error
    }
  }

  // Load news on-demand
  const loadNews = async (forceReload = false) => {
    if (loadedData.news && !forceReload) return // Already loaded
    
    try {
      console.log('📥 Admin: Loading news... (forceReload:', forceReload, ')')
      const newsData = await DataService.getNews()
      setNews(newsData)
      setLoadedData(prev => ({ ...prev, news: true }))
      console.log('✅ Admin: News loaded:', newsData.length)
    } catch (error) {
      console.error('❌ Admin: Error loading news:', error)
      throw error
    }
  }

  // Load publications on-demand
  const loadPublications = async (forceReload = false) => {
    if (loadedData.publications && !forceReload) return // Already loaded
    
    try {
      console.log('📥 Admin: Loading publications... (forceReload:', forceReload, ')')
      const publicationsData = await DataService.getPublications()
      setPublications(publicationsData)
      setLoadedData(prev => ({ ...prev, publications: true }))
      console.log('✅ Admin: Publications loaded:', publicationsData.length)
    } catch (error) {
      console.error('❌ Admin: Error loading publications:', error)
      throw error
    }
  }

  // Load videos on-demand
  const loadVideos = async (forceReload = false) => {
    if (loadedData.videos && !forceReload) return // Already loaded
    
    try {
      console.log('📥 Admin: Loading videos... (forceReload:', forceReload, ')')
      const videosData = await DataService.getVideos()
      setVideos(videosData)
      setLoadedData(prev => ({ ...prev, videos: true }))
      console.log('✅ Admin: Videos loaded:', videosData.length)
    } catch (error) {
      console.error('❌ Admin: Error loading videos:', error)
      throw error
    }
  }

  // Reload specific data type after mutation
  const reloadData = async (type: 'projects' | 'projectBriefs' | 'news' | 'publications' | 'videos' | 'categories') => {
    switch (type) {
      case 'projects':
        await loadProjects(true)
        break
      case 'projectBriefs':
        await loadProjectBriefs(true)
        break
      case 'news':
        await loadNews(true)
        break
      case 'publications':
        await loadPublications(true)
        break
      case 'videos':
        await loadVideos(true)
        break
      case 'categories':
        await loadCategories(true)
        break
    }
  }

  const loadData = async () => {
    // This function now loads ALL data - used for initial load or full refresh
    // In normal operation, use specific load functions instead
    try {
      console.log('� Admin: Loading all data...')
      setLoading(true)
      setLoadError(null)
      
      const [
        projectsData,
        newsData,
        publicationsData,
        videosData,
        newsCatsData,
        pubTypesData,
        pubCategoriesData,
        videoCatsData
      ] = await Promise.all([
        DataService.getProjects(),
        DataService.getNews(),
        DataService.getPublications(),
        DataService.getVideos(),
        DataService.getNewsCategories(),
        DataService.getPublicationTypes(),
        DataService.getPublicationCategories(),
        DataService.getVideoCategories()
      ])

      setProjects(projectsData)
      setNews(newsData)
      setPublications(publicationsData)
      setVideos(videosData)
      setNewsCategories(newsCatsData)
      setPublicationTypes(pubTypesData)
      setPublicationCategories(pubCategoriesData)
      setVideoCategories(videoCatsData)
      setLoadedData({
        projects: true,
        projectBriefs: true,
        news: true,
        publications: true,
        videos: true,
        categories: true
      })
      
      console.log('✅ Admin: All data loaded')
    } catch (error) {
      console.error('❌ Admin: Error loading data:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data'
      setLoadError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  // Get current user from auth context with proper role from profiles table
  const currentUser = user ? {
    id: user.id,
    email: user.email,
    role: user.role || 'contributor',
    name: user.name || user.full_name || user.email,
    full_name: user.full_name || user.name || user.email,
    avatar_url: user.avatar_url || '',
  } : undefined

  // Handle navigation from hamburger menu
  const handleNavigateFromPath = (path: string) => {
    // Navigate to clean public routes
    const pathToPageMap: Record<string, string> = {
      '/': '/',
      '/about': '/about',
      '/what-we-do': '/what-we-do',
      '/map': '/map',
      '/partner': '/partner-with-us'
    }
    
    const targetUrl = pathToPageMap[path]
    if (targetUrl) {
      router.push(targetUrl)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">This should only take a moment</p>
        </div>
      </div>
    )
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md p-6">
          <div className="mb-4" style={{ color: '#102447' }}>
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-gray-600 mb-4">Please log in with an admin account to access the dashboard.</p>
          <button
            onClick={() => router.push('/?showLogin=true')}
            className="w-full px-4 py-2 text-white rounded-md transition-colors"
            style={{ backgroundColor: '#102447' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0a1830'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#102447'}
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Show error state with retry option
  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md p-6">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{loadError}</p>
          <div className="space-y-2">
            <button
              onClick={() => loadData()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AdminDashboard 
        onNavigateToPublic={handleNavigateFromPath}
        projects={projects}
        onLoadProjects={loadProjects}
        onAddProject={async (projectData) => {
          try {
            console.log('📤 Admin page: Creating project...')
            console.log('📋 Project data:', projectData)
            const newProject = await DataService.createProject(projectData)
            console.log('✅ Admin page: Project created with ID:', newProject.id)
            console.log('🔄 Admin page: Current projects count before reload:', projects.length)
            await reloadData('projects')
            console.log('🔄 Admin page: Current projects count after reload:', projects.length)
            alert('✅ Project created successfully!')
          } catch (error) {
            console.error('❌ Admin page: Error creating project:', error)
            alert('❌ Failed to create project. Please check console for details.')
            throw error
          }
        }}
        onUpdateProject={async (project) => {
          await DataService.updateProject(project.id, project)
          await reloadData('projects')
        }}
        onDeleteProjects={async (projectIds) => {
          await DataService.deleteProjects(projectIds)
          await reloadData('projects')
        }}
        projectBriefs={projectBriefs}
        onLoadProjectBriefs={loadProjectBriefs}
        onAddProjectBrief={async (briefData) => {
          try {
            console.log('📤 Admin page: Creating project brief...')
            const newBrief = await DataService.createProjectBrief(briefData)
            console.log('✅ Admin page: Project brief created with ID:', newBrief.id)
            await reloadData('projectBriefs')
            alert('✅ Project brief created successfully!')
          } catch (error) {
            console.error('❌ Admin page: Error creating project brief:', error)
            alert('❌ Failed to create project brief. Please check console for details.')
            throw error
          }
        }}
        onUpdateProjectBrief={async (brief) => {
          await DataService.updateProjectBrief(brief.id!, brief)
          await reloadData('projectBriefs')
        }}
        onDeleteProjectBriefs={async (briefIds) => {
          await DataService.deleteProjectBriefs(briefIds)
          await reloadData('projectBriefs')
        }}
        news={news}
        onLoadNews={loadNews}
        onAddNews={async (articleData) => {
          try {
            console.log('📤 Admin page: Creating news...')
            console.log('📋 ArticleData received (FULL):', {
              title: articleData.title,
              category: articleData.category,
              description: articleData.description?.substring(0, 100) + '...',
              imageUrl: articleData.imageUrl,
              tagColor: articleData.tagColor,
              tags: articleData.tags,
              publishDate: articleData.publishDate,
              status: articleData.status,
              submittedBy: articleData.submittedBy,
              submittedAt: articleData.submittedAt,
              allKeys: Object.keys(articleData)
            })
            const baseSlug = articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
            const slug = `${baseSlug}-${Date.now()}`
            console.log('📝 Data being sent to DataService.createNews:', { ...articleData, slug })
            await DataService.createNews({ ...articleData, slug })
            console.log('✅ Admin page: News created, reloading news...')
            await reloadData('news')
            alert('✅ News created successfully!')
          } catch (error) {
            console.error('❌ Admin page: Error creating news:', error)
            alert('❌ Failed to create news. Please check console for details.')
            throw error
          }
        }}
        onUpdateNews={async (article) => {
          await DataService.updateNews(article.id!, article)
          await reloadData('news')
        }}
        onDeleteNews={async (articleIds) => {
          await DataService.deleteNews(articleIds)
          await reloadData('news')
        }}
        newsCategories={newsCategories}
        onAddNewsCategory={async (category) => {
          await DataService.createNewsCategory(category)
          await reloadData('categories')
        }}
        onUpdateNewsCategory={async (oldName, newName) => {
          await DataService.updateNewsCategory(oldName, newName)
          await reloadData('categories')
        }}
        onDeleteNewsCategory={async (categoryName) => {
          await DataService.deleteNewsCategory(categoryName)
          await reloadData('categories')
        }}
        publications={publications}
        onLoadPublications={loadPublications}
        onAddPublication={async (articleData) => {
          try {
            console.log('📤 Admin page: Creating publication...')
            const baseSlug = articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
            const slug = `${baseSlug}-${Date.now()}`
            await DataService.createPublication({ ...articleData, slug })
            console.log('✅ Admin page: Publication created, reloading publications...')
            await reloadData('publications')
            alert('✅ Publication created successfully!')
          } catch (error) {
            console.error('❌ Admin page: Error creating publication:', error)
            alert('❌ Failed to create publication. Please check console for details.')
            throw error
          }
        }}
        onUpdatePublication={async (article) => {
          try {
            console.log('📤 Admin page: Updating publication...', article.id)
            await DataService.updatePublication(article.id!, article)
            await reloadData('publications')
            alert('✅ Publication updated successfully!')
          } catch (error) {
            console.error('❌ Admin page: Error updating publication:', error)
            alert('❌ Failed to update publication. Please check console for details.')
            throw error
          }
        }}
        onDeletePublications={async (articleIds) => {
          await DataService.deletePublications(articleIds)
          await reloadData('publications')
        }}
        publicationTypes={publicationTypes}
        onAddPublicationType={async (type) => {
          await DataService.createPublicationType(type)
          await reloadData('categories')
        }}
        onUpdatePublicationType={async (oldName, newName) => {
          await DataService.updatePublicationType(oldName, newName)
          await reloadData('categories')
        }}
        onDeletePublicationType={async (typeName) => {
          await DataService.deletePublicationType(typeName)
          await reloadData('categories')
        }}
        publicationCategories={publicationCategories}
        onAddPublicationCategory={async (category) => {
          await DataService.createPublicationCategory(category)
          await reloadData('categories')
        }}
        onUpdatePublicationCategory={async (oldName, newName) => {
          await DataService.updatePublicationCategory(oldName, newName)
          await reloadData('categories')
        }}
        onDeletePublicationCategory={async (categoryName) => {
          await DataService.deletePublicationCategory(categoryName)
          await reloadData('categories')
        }}
        videos={videos}
        onLoadVideos={loadVideos}
        onAddVideo={async (articleData) => {
          try {
            console.log('📤 Admin page: Creating video...')
            const baseSlug = articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
            const slug = `${baseSlug}-${Date.now()}`
            await DataService.createVideo({ ...articleData, slug })
            console.log('✅ Admin page: Video created, reloading videos...')
            await reloadData('videos')
            alert('✅ Video created successfully!')
          } catch (error) {
            console.error('❌ Admin page: Error creating video:', error)
            alert('❌ Failed to create video. Please check console for details.')
            throw error
          }
        }}
        onUpdateVideo={async (article) => {
          await DataService.updateVideo(article.id!, article)
          await reloadData('videos')
        }}
        onDeleteVideos={async (articleIds) => {
          await DataService.deleteVideos(articleIds)
          await reloadData('videos')
        }}
        videoCategories={videoCategories}
        onAddVideoCategory={async (category) => {
          await DataService.createVideoCategory(category)
          await reloadData('categories')
        }}
        onUpdateVideoCategory={async (oldName, newName) => {
          await DataService.updateVideoCategory(oldName, newName)
          await reloadData('categories')
        }}
        onDeleteVideoCategory={async (categoryName) => {
          await DataService.deleteVideoCategory(categoryName)
          await reloadData('categories')
        }}
        onApproveDraft={async (item) => {
          try {
            console.log('✅ Admin: Approving draft:', item)
            
            switch (item.type) {
              case 'project':
                const project = projects.find(p => p.id === item.id)
                if (project) {
                  await DataService.updateProject(item.id, { ...project, status: 'published' })
                  await reloadData('projects')
                }
                break
              case 'news':
                const newsItem = news.find(n => n.id === item.id)
                if (newsItem) {
                  await DataService.updateNews(item.id, { ...newsItem, status: 'published' })
                  await reloadData('news')
                }
                break
              case 'publication':
                const publication = publications.find(p => p.id === item.id)
                if (publication) {
                  await DataService.updatePublication(item.id, { ...publication, status: 'published' })
                  await reloadData('publications')
                }
                break
              case 'video':
                const video = videos.find(v => v.id === item.id)
                if (video) {
                  await DataService.updateVideo(item.id, { ...video, status: 'published' })
                  await reloadData('videos')
                }
                break
            }
            
            alert(`✅ "${item.title}" has been approved and published!`)
          } catch (error) {
            console.error('❌ Admin: Error approving draft:', error)
            alert('❌ Failed to approve draft. Please try again.')
          }
        }}
        onRejectDraft={async (item) => {
          try {
            console.log('🗑️ Admin: Rejecting/deleting draft:', item)
            
            switch (item.type) {
              case 'project':
                await DataService.deleteProjects([item.id])
                await reloadData('projects')
                break
              case 'news':
                await DataService.deleteNews([item.id])
                await reloadData('news')
                break
              case 'publication':
                await DataService.deletePublications([item.id])
                await reloadData('publications')
                break
              case 'video':
                await DataService.deleteVideos([item.id])
                await reloadData('videos')
                break
            }
            
            alert(`🗑️ "${item.title}" has been rejected and deleted.`)
          } catch (error) {
            console.error('❌ Admin: Error rejecting draft:', error)
            alert('❌ Failed to reject draft. Please try again.')
          }
        }}
        onEditDraft={async (item) => {
          console.log('✏️ Admin: Edit draft requested:', item)
          // The AdminDashboard will handle navigation to the appropriate edit page
        }}
        currentUser={currentUser}
      />
    </div>
  )
}