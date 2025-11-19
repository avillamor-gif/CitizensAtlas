'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminDashboard } from '@/components/features/admin'
import { useAuth } from '@/contexts/AuthContext'
import { Project, Article } from '@/types/types'
import * as DataService from '@/lib/services/data-service'

export default function Admin() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [news, setNews] = useState<Article[]>([])
  const [publications, setPublications] = useState<Article[]>([])
  const [videos, setVideos] = useState<Article[]>([])
  const [newsCategories, setNewsCategories] = useState<string[]>([])
  const [publicationTypes, setPublicationTypes] = useState<string[]>([])
  const [videoCategories, setVideoCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Load data when component mounts or user changes
  useEffect(() => {
    if (!authLoading) {
      loadData()
    }
  }, [authLoading, user])

  const loadData = async () => {
    try {
      console.log('📥 Admin: Loading data...')
      console.log('🔍 Admin: Current user:', { 
        id: user?.id, 
        email: user?.email, 
        role: user?.role,
        hasAuthToken: !!localStorage.getItem('atlas-auth-token')
      })
      
      setLoading(true)
      setLoadError(null)
      
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Data loading timeout after 15 seconds')), 15000)
      })
      
      // Race between data loading and timeout
      const dataPromise = Promise.all([
        DataService.getProjects(),
        DataService.getNews(),
        DataService.getPublications(),
        DataService.getVideos(),
        DataService.getNewsCategories(),
        DataService.getPublicationTypes(),
        DataService.getVideoCategories()
      ])
      
      const [
        projectsData,
        newsData,
        publicationsData,
        videosData,
        newsCatsData,
        pubTypesData,
        videoCatsData
      ] = await Promise.race([dataPromise, timeoutPromise]) as [
        Project[],
        Article[],
        Article[],
        Article[],
        string[],
        string[],
        string[]
      ]

      setProjects(projectsData)
      setNews(newsData)
      setPublications(publicationsData)
      setVideos(videosData)
      setNewsCategories(newsCatsData)
      setPublicationTypes(pubTypesData)
      setVideoCategories(videoCatsData)
      
      console.log('✅ Admin: Data loaded successfully', {
        projects: projectsData.length,
        news: newsData.length,
        publications: publicationsData.length,
        videos: videosData.length,
        categories: newsCatsData.length,
        types: pubTypesData.length,
        videoCategories: videoCatsData.length
      })
    } catch (error) {
      console.error('❌ Admin: Error loading data:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data'
      setLoadError(errorMessage)
      
      // Set empty data on error so dashboard can still render
      setProjects([])
      setNews([])
      setPublications([])
      setVideos([])
      setNewsCategories([])
      setPublicationTypes([])
      setVideoCategories([])
    } finally {
      // Always clear loading state, even on error
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
    // Navigate to the main app with the page parameter
    const pathToPageMap: Record<string, string> = {
      '/': '/',
      '/about': '/?page=about',
      '/what-we-do': '/?page=what-we-do',
      '/map': '/?page=map',
      '/partner': '/?page=partner-with-us'
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
          <div className="text-blue-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-gray-600 mb-4">Please log in with an admin account to access the dashboard.</p>
          <button
            onClick={() => router.push('/?showLogin=true')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
        onAddProject={async (projectData) => {
          try {
            console.log('📤 Admin page: Creating project...')
            await DataService.createProject(projectData)
            console.log('✅ Admin page: Project created, reloading data...')
            await loadData()
            alert('✅ Project created successfully!')
          } catch (error) {
            console.error('❌ Admin page: Error creating project:', error)
            alert('❌ Failed to create project. Please check console for details.')
            throw error
          }
        }}
        onUpdateProject={async (project) => {
          await DataService.updateProject(project.id, project)
          await loadData()
        }}
        onDeleteProjects={async (projectIds) => {
          await DataService.deleteProjects(projectIds)
          await loadData()
        }}
        news={news}
        onAddNews={async (articleData) => {
          try {
            console.log('📤 Admin page: Creating news...')
            const slug = articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
            await DataService.createNews({ ...articleData, slug })
            console.log('✅ Admin page: News created, reloading data...')
            await loadData()
            alert('✅ News created successfully!')
          } catch (error) {
            console.error('❌ Admin page: Error creating news:', error)
            alert('❌ Failed to create news. Please check console for details.')
            throw error
          }
        }}
        onUpdateNews={async (article) => {
          await DataService.updateNews(article.id!, article)
          await loadData()
        }}
        onDeleteNews={async (articleIds) => {
          await DataService.deleteNews(articleIds)
          await loadData()
        }}
        newsCategories={newsCategories}
        onAddNewsCategory={async (category) => {
          await DataService.createNewsCategory(category)
          await loadData()
        }}
        onUpdateNewsCategory={async (oldName, newName) => {
          await DataService.updateNewsCategory(oldName, newName)
          await loadData()
        }}
        onDeleteNewsCategory={async (categoryName) => {
          await DataService.deleteNewsCategory(categoryName)
          await loadData()
        }}
        publications={publications}
        onAddPublication={async (articleData) => {
          try {
            console.log('📤 Admin page: Creating publication...')
            const slug = articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
            await DataService.createPublication({ ...articleData, slug })
            console.log('✅ Admin page: Publication created, reloading data...')
            await loadData()
            alert('✅ Publication created successfully!')
          } catch (error) {
            console.error('❌ Admin page: Error creating publication:', error)
            alert('❌ Failed to create publication. Please check console for details.')
            throw error
          }
        }}
        onUpdatePublication={async (article) => {
          await DataService.updatePublication(article.id!, article)
          await loadData()
        }}
        onDeletePublications={async (articleIds) => {
          await DataService.deletePublications(articleIds)
          await loadData()
        }}
        publicationTypes={publicationTypes}
        onAddPublicationType={async (type) => {
          await DataService.createPublicationType(type)
          await loadData()
        }}
        onUpdatePublicationType={async (oldName, newName) => {
          await DataService.updatePublicationType(oldName, newName)
          await loadData()
        }}
        onDeletePublicationType={async (typeName) => {
          await DataService.deletePublicationType(typeName)
          await loadData()
        }}
        videos={videos}
        onAddVideo={async (articleData) => {
          try {
            console.log('📤 Admin page: Creating video...')
            const slug = articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
            await DataService.createVideo({ ...articleData, slug })
            console.log('✅ Admin page: Video created, reloading data...')
            await loadData()
            alert('✅ Video created successfully!')
          } catch (error) {
            console.error('❌ Admin page: Error creating video:', error)
            alert('❌ Failed to create video. Please check console for details.')
            throw error
          }
        }}
        onUpdateVideo={async (article) => {
          await DataService.updateVideo(article.id!, article)
          await loadData()
        }}
        onDeleteVideos={async (articleIds) => {
          await DataService.deleteVideos(articleIds)
          await loadData()
        }}
        videoCategories={videoCategories}
        onAddVideoCategory={async (category) => {
          await DataService.createVideoCategory(category)
          await loadData()
        }}
        onUpdateVideoCategory={async (oldName, newName) => {
          await DataService.updateVideoCategory(oldName, newName)
          await loadData()
        }}
        onDeleteVideoCategory={async (categoryName) => {
          await DataService.deleteVideoCategory(categoryName)
          await loadData()
        }}
        onApproveDraft={async (item) => {
          // TODO: Implement approve draft
          await loadData()
        }}
        onRejectDraft={async (item) => {
          // TODO: Implement reject draft
          await loadData()
        }}
        onEditDraft={async (item) => {
          // TODO: Implement edit draft
        }}
        currentUser={currentUser}
      />
    </div>
  )
}