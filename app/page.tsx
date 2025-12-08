'use client'

import React, { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { AdminDashboard } from '@/components/features/admin'
import { Home, AboutPage, WhatWeDoPage, PartnerPage } from '@/components/pages'
import { MapPage } from '@/components/features/map'
import { ArticleListPage, ArticleDetailPage } from '@/components/features/articles'
import { projectCardsData, getIfiAbbreviation, newsData as initialNewsData, publicationsData as initialPublicationsData, videosData } from '@/lib/constants'
import { Project, Filters, Article, Page, User } from '@/types/types'
import { notifyAdminOfNewSubmission, notifyContributorOfStatus } from '@/utils/notifications'
import * as dataService from '@/lib/services/data-service'
import { updateProject, updateNews, updatePublication, updateVideo } from '@/lib/services/data-service'
import { useAuth } from '@/contexts/AuthContext'

const slugify = (text: string) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-dark-blue to-brand-light-blue">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading Citizens' Atlas...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user: currentUser, loading: authLoading } = useAuth()

  // Hydration fix: only render after client mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Initialize state - will be loaded from Supabase
  const [projects, setProjects] = useState<Project[]>([])
  const [news, setNews] = useState<Article[]>([])
  const [publications, setPublications] = useState<Article[]>([])
  const [videos, setVideos] = useState<Article[]>([])
  const [newsCategories, setNewsCategories] = useState<string[]>([])
  const [publicationTypes, setPublicationTypes] = useState<string[]>([])
  const [videoCategories, setVideoCategories] = useState<string[]>([])
  const [isAdminView, setIsAdminView] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  const [activePage, setActivePage] = useState<Page>('home')
  const [activeArticle, setActiveArticle] = useState<Article | null>(null)
  const [articleSource, setArticleSource] = useState<Page>('home')
  const [activeView, setActiveView] = useState<'Map' | 'Projects'>('Map')
  const [filters, setFilters] = useState<Filters>({
    country: 'all',
    solutionType: 'all',
    ifi: 'all',
    projectStatus: 'all',
  })

  // Load data from Supabase on mount
  const loadDataFromSupabase = async () => {
    try {
      setDataLoading(true)
      console.log('🔄 Loading data from Supabase...')
      
      const startTime = Date.now()
      
      // Load critical data first (projects with details for map, recent content)
      const [
        projectsData,
        newsData,
        publicationsData,
        videosData,
      ] = await Promise.all([
        dataService.getPublishedProjectsWithDetails(), // Need details field for map visualization
        dataService.getPublishedNews(10), // Limit to 10 for homepage carousel
        dataService.getPublishedPublications(10), // Limit to 10 for homepage carousel
        dataService.getPublishedVideos(10), // Limit to 10 for homepage carousel
      ])
      
      // Load categories in background (non-blocking)
      Promise.all([
        dataService.getNewsCategories(),
        dataService.getPublicationTypes(),
        dataService.getVideoCategories()
      ]).then(([newsCategoriesData, publicationTypesData, videoCategoriesData]) => {
        setNewsCategories(newsCategoriesData)
        setPublicationTypes(publicationTypesData)
        setVideoCategories(videoCategoriesData)
      })

      const loadTime = Date.now() - startTime
      console.log('✅ Data loaded from Supabase in', loadTime, 'ms:', {
        projects: projectsData.length,
        news: newsData.length,
        publications: publicationsData.length,
        videos: videosData.length,
      })

      setProjects(projectsData)
      setNews(newsData)
      setPublications(publicationsData)
      setVideos(videosData)
    } catch (error) {
      console.error('❌ Failed to load data from Supabase:', error)
      alert('Failed to load data. Please refresh the page.')
    } finally {
      setDataLoading(false)
    }
  }

  useEffect(() => {
    loadDataFromSupabase()
  }, [])

  // Handle browser back/forward navigation
  useEffect(() => {
    if (!searchParams) return
    
    const page = searchParams.get('page') as Page | null
    const articleSlug = searchParams.get('article')
    const admin = searchParams.get('admin')

    if (admin === 'true') {
      setIsAdminView(true)
    } else {
      setIsAdminView(false)
      
      if (articleSlug) {
        // Find article from all sources
        const allArticles = [...news, ...videos, ...publications]
        const article = allArticles.find(a => a.slug === articleSlug)
        if (article) {
          setActiveArticle(article)
          if (page) setActivePage(page)
        }
      } else {
        setActiveArticle(null)
        if (page) {
          setActivePage(page)
        } else {
          setActivePage('home')
        }
      }
    }
  }, [searchParams, news, publications, videos])

  // Project Handlers
  const handleAddProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      console.log('🚀 [handleAddProject] Starting project creation...')
      console.log('👤 Current user role:', currentUser?.role)
      console.log('📝 Project data:', projectData)
      
      const status: 'draft' | 'published' = currentUser?.role === 'contributor' ? 'draft' : 'published'
      
      const projectToSave = {
        ...projectData,
        status,
        submittedBy: currentUser?.name || currentUser?.email || 'Anonymous',
        submittedAt: new Date().toISOString(),
      }
      
      console.log('💾 Saving to Supabase with status:', projectToSave.status)
      
      const newProject = await dataService.createProject(projectToSave)
      
      console.log('✅ Project saved successfully:', newProject)
      
      setProjects(prevProjects => [newProject, ...prevProjects])
      
      const message = currentUser?.role === 'contributor' 
        ? '✅ Project submitted for approval!' 
        : '✅ Project added successfully!';
      alert(message)
      
      // Send notification to admin if contributor submitted
      if (currentUser?.role === 'contributor') {
        notifyAdminOfNewSubmission({
          contributorName: currentUser.name || currentUser.email,
          contributorEmail: currentUser.email,
          contentType: 'project',
          contentTitle: projectData.title,
          submittedAt: newProject.submittedAt!,
        }).catch(error => console.error('Failed to send notification:', error))
      }
    } catch (error) {
      console.error('❌❌❌ CRITICAL ERROR in handleAddProject:', error)
      console.error('❌ Error details:', JSON.stringify(error, null, 2))
      console.error('❌ Error message:', (error as any)?.message)
      console.error('❌ Error code:', (error as any)?.code)
      alert('❌ Failed to add project. Check console for details.')
    }
  }

  const handleUpdateProject = async (updatedProject: Project) => {
    console.log('Updating project:', updatedProject)
    try {
      // Call the backend API to update the project
      const result = await dataService.updateProject(updatedProject.id, updatedProject)
      
      // Update local state with the result
      setProjects(prevProjects => 
        prevProjects.map(p => p.id === result.id ? result : p)
      )
      
      alert('✅ Project updated successfully!')
    } catch (error) {
      console.error('Failed to update project:', error)
      alert('❌ Failed to update project. Please try again.')
    }
  }

  const handleDeleteProjects = (projectIds: number[]) => {
    console.log('Deleting projects:', projectIds)
    setProjects(prevProjects => prevProjects.filter(p => !projectIds.includes(p.id)))
    alert(`✅ ${projectIds.length} project(s) deleted successfully!`)
  }

  // News Handlers
  const handleAddNews = async (newsData: Omit<Article, 'id' | 'slug'>) => {
    console.log('Adding news:', newsData)
    try {
      const newArticle = await dataService.createNews({
        ...newsData,
        slug: slugify(newsData.title),
        status: currentUser?.role === 'contributor' ? 'draft' : 'published',
        submittedBy: currentUser?.name || currentUser?.email,
        submittedAt: new Date().toISOString(),
      })
      
      setNews(prevNews => [newArticle, ...prevNews])
      console.log('✅ News added with status:', newArticle.status, 'Article:', newArticle)
      
      // Auto-add new category to database if it doesn't exist
      if (newsData.category && !newsCategories.includes(newsData.category)) {
        try {
          console.log('💾 Auto-adding new category to database:', newsData.category)
          await dataService.createNewsCategory(newsData.category)
          setNewsCategories(prev => [...prev, newsData.category].sort())
        } catch (error) {
          console.error('Failed to add category to database:', error)
          // Still update local state even if database fails
          setNewsCategories(prev => [...prev, newsData.category].sort())
        }
      }
      
      const message = currentUser?.role === 'contributor' 
        ? '✅ News submitted for approval!' 
        : '✅ News article added successfully!';
      alert(message)
      
      // Send notification to admin if contributor submitted
      if (currentUser?.role === 'contributor') {
        notifyAdminOfNewSubmission({
          contributorName: currentUser.name || currentUser.email,
          contributorEmail: currentUser.email,
          contentType: 'news',
          contentTitle: newsData.title,
          submittedAt: newArticle.submittedAt!,
        }).catch(error => console.error('Failed to send notification:', error))
      }
    } catch (error) {
      console.error('Failed to add news:', error)
      alert('❌ Failed to add news article. Please try again.')
    }
  }

  const handleUpdateNews = async (updatedArticleData: Omit<Article, 'slug'>) => {
    console.log('📝 [handleUpdateNews] Starting update process...')
    console.log('📝 [handleUpdateNews] Updated article data:', {
      id: updatedArticleData.id,
      title: updatedArticleData.title,
      category: updatedArticleData.category,
      description: updatedArticleData.description?.substring(0, 100),
      imageUrl: updatedArticleData.imageUrl,
      tagColor: updatedArticleData.tagColor,
      tags: updatedArticleData.tags,
      allKeys: Object.keys(updatedArticleData)
    })
    try {
      // Call the backend API to update the news
      const updatedArticle = await dataService.updateNews(updatedArticleData.id, updatedArticleData)
      
      console.log('✅ [handleUpdateNews] Got response from updateNews:', {
        id: updatedArticle.id,
        title: updatedArticle.title,
        category: updatedArticle.category,
        imageUrl: updatedArticle.imageUrl,
        allKeys: Object.keys(updatedArticle)
      })
      
      // Update local state with the result
      const finalArticle = { 
        ...updatedArticle, 
        slug: slugify(updatedArticle.title) + '-' + updatedArticle.id 
      }
      setNews(prevNews =>
        prevNews.map(n => (n.id === finalArticle.id ? finalArticle : n))
      )
      
      // Auto-add new category to database if it doesn't exist
      if (finalArticle.category && !newsCategories.includes(finalArticle.category)) {
        try {
          console.log('💾 Auto-adding new category to database:', finalArticle.category)
          await dataService.createNewsCategory(finalArticle.category)
          setNewsCategories(prev => [...prev, finalArticle.category].sort())
        } catch (error) {
          console.error('Failed to add category to database:', error)
          // Still update local state even if database fails
          setNewsCategories(prev => [...prev, finalArticle.category].sort())
        }
      }
      
      alert('✅ News article updated successfully!')
    } catch (error) {
      console.error('Failed to update news:', error)
      alert('❌ Failed to update news article. Please try again.')
    }
  }

  const handleDeleteNews = (articleIds: number[]) => {
    setNews(prevNews => prevNews.filter(n => !articleIds.includes(n.id)))
    alert(`✅ ${articleIds.length} news article(s) deleted successfully!`)
  }

  // Publication Handlers
  const handleAddPublication = async (publicationData: Omit<Article, 'id' | 'slug'>) => {
    try {
      const newArticle = await dataService.createPublication({
        ...publicationData,
        slug: slugify(publicationData.title),
        status: currentUser?.role === 'contributor' ? 'draft' : 'published',
        submittedBy: currentUser?.name || currentUser?.email,
        submittedAt: new Date().toISOString(),
      })
      
      setPublications(prevPublications => [newArticle, ...prevPublications])
      
      // Auto-add new publication type to database if it doesn't exist
      if (publicationData.category && !publicationTypes.includes(publicationData.category)) {
        try {
          console.log('💾 Auto-adding new publication type to database:', publicationData.category)
          await dataService.createPublicationType(publicationData.category)
          setPublicationTypes(prev => [...prev, publicationData.category].sort())
        } catch (error) {
          console.error('Failed to add publication type to database:', error)
          // Still update local state even if database fails
          setPublicationTypes(prev => [...prev, publicationData.category].sort())
        }
      }
      
      const message = currentUser?.role === 'contributor' 
        ? '✅ Publication submitted for approval!' 
        : '✅ Publication added successfully!';
      alert(message)
      
      // Send notification to admin if contributor submitted
      if (currentUser?.role === 'contributor') {
        notifyAdminOfNewSubmission({
          contributorName: currentUser.name || currentUser.email,
          contributorEmail: currentUser.email,
          contentType: 'publication',
          contentTitle: publicationData.title,
          submittedAt: newArticle.submittedAt!,
        }).catch(error => console.error('Failed to send notification:', error))
      }
    } catch (error) {
      console.error('Failed to add publication:', error)
      alert('❌ Failed to add publication. Please try again.')
    }
  }

  const handleUpdatePublication = async (updatedArticleData: Omit<Article, 'slug'>) => {
    console.log('Updating publication:', updatedArticleData)
    try {
      // Call the backend API to update the publication
      const updatedArticle = await dataService.updatePublication(updatedArticleData.id, updatedArticleData)
      
      // Update local state with the result
      const finalArticle = { 
        ...updatedArticle, 
        slug: slugify(updatedArticle.title) + '-' + updatedArticle.id 
      }
      setPublications(prevPublications =>
        prevPublications.map(p => (p.id === finalArticle.id ? finalArticle : p))
      )
      
      // Auto-add new publication type to database if it doesn't exist
      if (finalArticle.category && !publicationTypes.includes(finalArticle.category)) {
        try {
          console.log('💾 Auto-adding new publication type to database:', finalArticle.category)
          await dataService.createPublicationType(finalArticle.category)
          setPublicationTypes(prev => [...prev, finalArticle.category].sort())
        } catch (error) {
          console.error('Failed to add publication type to database:', error)
          // Still update local state even if database fails
          setPublicationTypes(prev => [...prev, finalArticle.category].sort())
        }
      }
      
      alert('✅ Publication updated successfully!')
    } catch (error) {
      console.error('Failed to update publication:', error)
      alert('❌ Failed to update publication. Please try again.')
    }
  }

  const handleDeletePublications = (articleIds: number[]) => {
    setPublications(prevPublications => prevPublications.filter(p => !articleIds.includes(p.id)))
    alert(`✅ ${articleIds.length} publication(s) deleted successfully!`)
  }
  
  const handleIncrementDownloadCount = (articleId: number) => {
    setPublications(prevPublications =>
      prevPublications.map(pub =>
        pub.id === articleId
          ? { ...pub, downloadCount: (pub.downloadCount || 0) + 1 }
          : pub
      )
    )
  }

  // Video Handlers
  const handleAddVideo = async (videoData: Omit<Article, 'id' | 'slug'>) => {
    console.log('Adding video:', videoData)
    try {
      const newArticle = await dataService.createVideo({
        ...videoData,
        slug: slugify(videoData.title),
        status: currentUser?.role === 'contributor' ? 'draft' : 'published',
        submittedBy: currentUser?.name || currentUser?.email || 'Anonymous',
        submittedAt: new Date().toISOString(),
      })
      
      setVideos(prevVideos => [newArticle, ...prevVideos])
      
      // Auto-add new video category to database if it doesn't exist
      if (videoData.category && !videoCategories.includes(videoData.category)) {
        try {
          console.log('💾 Auto-adding new video category to database:', videoData.category)
          await dataService.createVideoCategory(videoData.category)
          setVideoCategories(prev => [...prev, videoData.category].sort())
        } catch (error) {
          console.error('Failed to add video category to database:', error)
          // Still update local state even if database fails
          setVideoCategories(prev => [...prev, videoData.category].sort())
        }
      }
      
      const message = currentUser?.role === 'contributor' 
        ? '✅ Video submitted for approval!' 
        : '✅ Video added successfully!';
      alert(message)
      
      // Send notification to admin if contributor submitted
      if (currentUser?.role === 'contributor') {
        notifyAdminOfNewSubmission({
          contributorName: currentUser.name || currentUser.email,
          contributorEmail: currentUser.email,
          contentType: 'video',
          contentTitle: videoData.title,
          submittedAt: newArticle.submittedAt!,
        }).catch(error => console.error('Failed to send notification:', error))
      }
    } catch (error) {
      console.error('Failed to add video:', error)
      alert('❌ Failed to add video. Please try again.')
    }
  }

  const handleUpdateVideo = async (updatedArticleData: Omit<Article, 'slug'>) => {
    console.log('Updating video:', updatedArticleData)
    try {
      // Call the backend API to update the video
      const updatedArticle = await dataService.updateVideo(updatedArticleData.id, updatedArticleData)
      
      // Update local state with the result
      const finalArticle = { 
        ...updatedArticle, 
        slug: slugify(updatedArticle.title) + '-' + updatedArticle.id 
      }
      setVideos(prevVideos =>
        prevVideos.map(v => (v.id === finalArticle.id ? finalArticle : v))
      )
      
      // Auto-add new video category to database if it doesn't exist
      if (finalArticle.category && !videoCategories.includes(finalArticle.category)) {
        try {
          console.log('💾 Auto-adding new video category to database:', finalArticle.category)
          await dataService.createVideoCategory(finalArticle.category)
          setVideoCategories(prev => [...prev, finalArticle.category].sort())
        } catch (error) {
          console.error('Failed to add video category to database:', error)
          // Still update local state even if database fails
          setVideoCategories(prev => [...prev, finalArticle.category].sort())
        }
      }
      
      alert('✅ Video updated successfully!')
    } catch (error) {
      console.error('Failed to update video:', error)
      alert('❌ Failed to update video. Please try again.')
    }
  }

  const handleDeleteVideos = (articleIds: number[]) => {
    setVideos(prevVideos => prevVideos.filter(v => !articleIds.includes(v.id)))
    alert(`✅ ${articleIds.length} video(s) deleted successfully!`)
  }

  // Video Category Handlers
  const handleAddVideoCategory = async (category: string) => {
    if (category && !videoCategories.includes(category)) {
      try {
        console.log('💾 Adding video category to database:', category)
        await dataService.createVideoCategory(category)
        setVideoCategories(prev => [...prev, category].sort())
        alert('✅ Video category added successfully!')
      } catch (error) {
        console.error('Failed to add video category:', error)
        alert('❌ Failed to add video category. Please try again.')
      }
    }
  }

  const handleUpdateVideoCategory = async (oldName: string, newName: string) => {
    if (newName && !videoCategories.includes(newName)) {
      try {
        console.log('💾 Updating video category in database:', { oldName, newName })
        await dataService.updateVideoCategory(oldName, newName)
        
        setVideoCategories(prev => 
          prev.map(c => c === oldName ? newName : c).sort()
        )
        setVideos(prevVideos => 
          prevVideos.map(video => 
            video.category === oldName ? { ...video, category: newName } : video
          )
        )
        alert('✅ Video category updated successfully!')
      } catch (error) {
        console.error('Failed to update video category:', error)
        alert('❌ Failed to update video category. Please try again.')
      }
    } else if (newName !== oldName) {
      alert(`Category "${newName}" already exists.`)
    }
  }

  const handleDeleteVideoCategory = async (categoryName: string) => {
    const isCategoryInUse = videos.some(video => video.category === categoryName)
    if (isCategoryInUse) {
      alert(`Cannot delete category "${categoryName}" as it's currently in use by one or more videos.`)
      return
    }
    
    try {
      console.log('💾 Deleting video category from database:', categoryName)
      await dataService.deleteVideoCategory(categoryName)
      setVideoCategories(prev => prev.filter(c => c !== categoryName))
      alert('✅ Video category deleted successfully!')
    } catch (error) {
      console.error('Failed to delete video category:', error)
      alert('❌ Failed to delete video category. Please try again.')
    }
  }

  // News Category Handlers
  const handleAddNewsCategory = async (category: string) => {
    if (category && !newsCategories.includes(category)) {
      try {
        console.log('💾 Adding news category to database:', category)
        await dataService.createNewsCategory(category)
        setNewsCategories(prev => [...prev, category].sort())
        alert('✅ News category added successfully!')
      } catch (error) {
        console.error('Failed to add news category:', error)
        alert('❌ Failed to add news category. Please try again.')
      }
    }
  }

  const handleUpdateNewsCategory = async (oldName: string, newName: string) => {
    if (newName && !newsCategories.includes(newName)) {
      try {
        console.log('💾 Updating news category in database:', { oldName, newName })
        await dataService.updateNewsCategory(oldName, newName)
        
        // Update category in the categories list
        setNewsCategories(prev => 
          prev.map(c => c === oldName ? newName : c).sort()
        )
        
        // Update category in all associated news articles
        setNews(prevNews => 
          prevNews.map(article => 
            article.category === oldName ? { ...article, category: newName } : article
          )
        )
        
        alert('✅ News category updated successfully!')
      } catch (error) {
        console.error('Failed to update news category:', error)
        alert('❌ Failed to update news category. Please try again.')
      }
    } else if (newName !== oldName) {
      alert(`Category "${newName}" already exists.`)
    }
  }

  const handleDeleteNewsCategory = async (categoryName: string) => {
    const isCategoryInUse = news.some(article => article.category === categoryName)
    if (isCategoryInUse) {
      alert(`Cannot delete category "${categoryName}" as it's currently in use by one or more articles.`)
      return
    }
    
    try {
      console.log('💾 Deleting news category from database:', categoryName)
      await dataService.deleteNewsCategory(categoryName)
      setNewsCategories(prev => prev.filter(c => c !== categoryName))
      alert('✅ News category deleted successfully!')
    } catch (error) {
      console.error('Failed to delete news category:', error)
      alert('❌ Failed to delete news category. Please try again.')
    }
  }

  // Publication Type Handlers
  const handleAddPublicationType = async (type: string) => {
    if (type && !publicationTypes.includes(type)) {
      try {
        console.log('💾 Adding publication type to database:', type)
        await dataService.createPublicationType(type)
        setPublicationTypes(prev => [...prev, type].sort())
        alert('✅ Publication type added successfully!')
      } catch (error) {
        console.error('Failed to add publication type:', error)
        alert('❌ Failed to add publication type. Please try again.')
      }
    }
  }

  const handleUpdatePublicationType = async (oldName: string, newName: string) => {
    if (newName && !publicationTypes.includes(newName)) {
      try {
        console.log('💾 Updating publication type in database:', { oldName, newName })
        await dataService.updatePublicationType(oldName, newName)
        
        setPublicationTypes(prev => 
          prev.map(t => t === oldName ? newName : t).sort()
        )
        setPublications(prevPubs => 
          prevPubs.map(pub => 
            pub.category === oldName ? { ...pub, category: newName } : pub
          )
        )
        alert('✅ Publication type updated successfully!')
      } catch (error) {
        console.error('Failed to update publication type:', error)
        alert('❌ Failed to update publication type. Please try again.')
      }
    } else if (newName !== oldName) {
      alert(`Publication type "${newName}" already exists.`)
    }
  }

  const handleDeletePublicationType = async (typeName: string) => {
    const isTypeInUse = publications.some(pub => pub.category === typeName)
    if (isTypeInUse) {
      alert(`Cannot delete type "${typeName}" as it's currently in use by one or more publications.`)
      return
    }
    
    try {
      console.log('💾 Deleting publication type from database:', typeName)
      await dataService.deletePublicationType(typeName)
      setPublicationTypes(prev => prev.filter(t => t !== typeName))
      alert('✅ Publication type deleted successfully!')
    } catch (error) {
      console.error('Failed to delete publication type:', error)
      alert('❌ Failed to delete publication type. Please try again.')
    }
  }

  // Draft Approval Handlers
  const handleApproveDraft = async (item: { id: number; type: 'project' | 'news' | 'publication' | 'video'; submittedBy?: string; title?: string }) => {
    const { id, type } = item;
    console.log('🔄 Approving draft:', { id, type })
    let approvedItem: (Project | Article) | undefined;
    // Helper to strip large fields
    const stripLargeFields = (obj: any) => {
      const { content, pdf, images, ...rest } = obj;
      return rest;
    };
    
    try {
      // Update status in Supabase first
      console.log('📝 Updating status to published in database...')
      switch (type) {
        case 'project':
          approvedItem = projects.find(p => p.id === id);
          await updateProject(id, { status: 'published' })
          setProjects(prevProjects =>
            prevProjects.map(p =>
              p.id === id ? { ...stripLargeFields(p), status: 'published' as const } : p
            )
          )
          break
        case 'news':
          approvedItem = news.find(n => n.id === id);
          await updateNews(id, { status: 'published' })
          setNews(prevNews =>
            prevNews.map(n =>
              n.id === id ? { ...stripLargeFields(n), status: 'published' as const } : n
            )
          )
          break
        case 'publication':
          approvedItem = publications.find(p => p.id === id);
          await updatePublication(id, { status: 'published' })
          setPublications(prevPublications =>
            prevPublications.map(p =>
              p.id === id ? { ...stripLargeFields(p), status: 'published' as const } : p
            )
          )
          break
        case 'video':
          approvedItem = videos.find(v => v.id === id);
          await updateVideo(id, { status: 'published' })
          setVideos(prevVideos =>
            prevVideos.map(v =>
              v.id === id ? { ...stripLargeFields(v), status: 'published' as const } : v
            )
          )
          break
      }
      console.log('✅ Status updated successfully in database')
      alert('✅ Draft approved and published successfully!')
    } catch (error) {
      console.error('❌ Failed to approve draft:', error)
      alert('❌ Failed to approve draft. Please try again.')
      return
    }
    if (approvedItem && approvedItem.submittedBy) {
      const contributorEmail = `${approvedItem.submittedBy.toLowerCase().replace(/\s+/g, '.')}` + '@example.com';
      const title = type === 'project' ? (approvedItem as Project).title : (approvedItem as Article).title;
      notifyContributorOfStatus({
        contributorEmail,
        contributorName: approvedItem.submittedBy,
        contentType: type,
        contentTitle: title,
        status: 'approved',
        adminName: currentUser?.name || currentUser?.email,
      }).catch(error => console.error('Failed to send notification:', error))
    }
  }

  const handleRejectDraft = (item: { id: number; type: 'project' | 'news' | 'publication' | 'video'; submittedBy?: string; title?: string }) => {
    const { id, type } = item;
    console.log('Rejecting draft:', { id, type })
    let rejectedItem: (Project | Article) | undefined;
    switch (type) {
      case 'project':
        rejectedItem = projects.find(p => p.id === id);
        setProjects(prevProjects => prevProjects.filter(p => p.id !== id))
        break
      case 'news':
        rejectedItem = news.find(n => n.id === id);
        setNews(prevNews => prevNews.filter(n => n.id !== id))
        break
      case 'publication':
        rejectedItem = publications.find(p => p.id === id);
        setPublications(prevPublications => prevPublications.filter(p => p.id !== id))
        break
      case 'video':
        rejectedItem = videos.find(v => v.id === id);
        setVideos(prevVideos => prevVideos.filter(v => v.id !== id))
        break
    }
    alert('✅ Draft rejected and deleted successfully!')
    if (rejectedItem && rejectedItem.submittedBy) {
      const contributorEmail = `${rejectedItem.submittedBy.toLowerCase().replace(/\s+/g, '.')}` + '@example.com';
      const title = type === 'project' ? (rejectedItem as Project).title : (rejectedItem as Article).title;
      notifyContributorOfStatus({
        contributorEmail,
        contributorName: rejectedItem.submittedBy,
        contentType: type,
        contentTitle: title,
        status: 'rejected',
        adminName: currentUser?.name || currentUser?.email,
      }).catch(error => console.error('Failed to send notification:', error))
    }
  }

  const handleEditDraft = (item: { id: number; type: 'project' | 'news' | 'publication' | 'video' }) => {
    const { id, type } = item;
    console.log('Editing draft:', { id, type })
    switch (type) {
      case 'project':
        setActivePage('projects-list' as Page)
        break
      case 'news':
        setActivePage('news-list' as Page)
        break
      case 'publication':
        setActivePage('publications-list' as Page)
        break
      case 'video':
        setActivePage('videos-list' as Page)
        break
    }
  }

  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }))
  }

  // Navigation handlers
  const handleNavigate = (page: Page) => {
      router.push(`?page=${page}`)
  }
  
  const handleNavigateFromPath = (path: string) => {
    // Convert URL paths to Page types
    const pathToPageMap: Record<string, Page> = {
      '/': 'home',
      '/about': 'about',
      '/what-we-do': 'what-we-do',
      '/map': 'map',
      '/partner': 'partner-with-us'
    };
    
    const page = pathToPageMap[path];
    if (page) {
      setIsAdminView(false);
      handleNavigate(page);
    } else {
      // Fallback - just go to home
      router.push('/');
    }
  }
  
  const handleViewArticle = (article: Article) => {
      setArticleSource(activePage)
      let targetPage = activePage
      if (news.some(a => a.id === article.id)) targetPage = 'news'
      else if (videos.some(a => a.id === article.id)) targetPage = 'videos'
      else if (publications.some(a => a.id === article.id)) targetPage = 'publications'
      
      router.push(`?page=${targetPage}&article=${article.slug}`)
  }

  const handleReturnToList = () => {
      if (articleSource === 'home') {
          router.push('/')
      } else {
          router.push(`?page=${articleSource}`)
      }
  }

  const filterOptions = useMemo(() => {
    const parseDetail = (details: string, key: string) => {
        const match = details.match(new RegExp(`\\*\\*${key}:\\*\\*(.*)`))
        return match ? match[1].trim() : ''
    }

    // Helper to convert to title case
    const toTitleCase = (str: string) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    // Get unique countries from published projects only, normalize to title case, and sort alphabetically
    const uniqueCountries = Array.from(
        new Set(
            projects
                .filter(p => p.status === 'published' || p.status === undefined)
                .map(p => p.country)
                .filter(c => c) // Remove empty values
                .map(c => toTitleCase(c))
        )
    ).sort((a, b) => a.localeCompare(b))
    
    const countries = ['all', ...uniqueCountries]
    const solutionTypes = ['all', ...Array.from(new Set(projects.flatMap(p => p.corruptionType.split(',').map((s: string) => s.trim()))))]
    const ifis = ['all', ...Array.from(new Set(projects.map(p => getIfiAbbreviation(parseDetail(p.details, 'IFI') || 'N/A'))))]
    const projectStatuses = ['all', ...Array.from(new Set(projects.map(p => parseDetail(p.details, 'Project Status'))))].filter(status => status && status !== 'N/A')
    return { countries, solutionTypes, ifis, projectStatuses }
  }, [projects])

  const filteredProjects = useMemo(() => {
    const parseDetail = (details: string, key: string) => {
        const match = details.match(new RegExp(`\\*\\*${key}:\\*\\*(.*)`))
        return match ? match[1].trim() : ''
    }

    // Helper to convert to title case
    const toTitleCase = (str: string) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    return projects.filter(project => {
      // Only show published projects in public view
      const publishedMatch = project.status === 'published' || project.status === undefined
      const countryMatch = filters.country === 'all' || toTitleCase(project.country || '') === filters.country
      const solutionMatch = filters.solutionType === 'all' || project.corruptionType.includes(filters.solutionType)
      const ifiMatch = filters.ifi === 'all' || getIfiAbbreviation(parseDetail(project.details, 'IFI') || 'N/A') === filters.ifi
      const statusMatch = filters.projectStatus === 'all' || parseDetail(project.details, 'Project Status') === filters.projectStatus

      return publishedMatch && countryMatch && solutionMatch && ifiMatch && statusMatch
    })
  }, [projects, filters])

  // Filter published content for public views
  const publishedNews = useMemo(() => 
    news.filter(n => n.status === 'published' || n.status === undefined)
  , [news])
  
  const publishedPublications = useMemo(() => 
    publications.filter(p => p.status === 'published' || p.status === undefined)
  , [publications])
  
  const publishedVideos = useMemo(() => 
    videos.filter(v => v.status === 'published' || v.status === undefined)
  , [videos])

  const renderContent = () => {
    if (isAdminView) {
      return (
        <AdminDashboard 
          projects={projects}
          onAddProject={handleAddProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProjects={handleDeleteProjects}
          news={news}
          onAddNews={handleAddNews}
          onUpdateNews={handleUpdateNews}
          onDeleteNews={handleDeleteNews}
          newsCategories={newsCategories}
          onAddNewsCategory={handleAddNewsCategory}
          onUpdateNewsCategory={handleUpdateNewsCategory}
          onDeleteNewsCategory={handleDeleteNewsCategory}
          publications={publications}
          onAddPublication={handleAddPublication}
          onUpdatePublication={handleUpdatePublication}
          onDeletePublications={handleDeletePublications}
          publicationTypes={publicationTypes}
          onAddPublicationType={handleAddPublicationType}
          onUpdatePublicationType={handleUpdatePublicationType}
          onDeletePublicationType={handleDeletePublicationType}
          videos={videos}
          onAddVideo={handleAddVideo}
          onUpdateVideo={handleUpdateVideo}
          onDeleteVideos={handleDeleteVideos}
          videoCategories={videoCategories}
          onAddVideoCategory={handleAddVideoCategory}
          onUpdateVideoCategory={handleUpdateVideoCategory}
          onDeleteVideoCategory={handleDeleteVideoCategory}
          onApproveDraft={item => handleApproveDraft(item)}
          onRejectDraft={item => handleRejectDraft(item)}
          onEditDraft={item => handleEditDraft(item)}
          currentUser={currentUser ?? undefined}
          onNavigateToPublic={handleNavigateFromPath}
        />
      )
    }
    
    if (activeArticle) {
      return <ArticleDetailPage article={activeArticle} onBack={handleReturnToList} sourcePage={articleSource} />
    }

    switch (activePage) {
      case 'home':
        return (
          <Home
            projects={filteredProjects}
            onAddProject={handleAddProject}
            filters={filters}
            onFilterChange={handleFilterChange}
            filterOptions={filterOptions}
            activeView={activeView}
            setActiveView={setActiveView}
            newsData={publishedNews}
            publicationsData={publishedPublications}
            videosData={publishedVideos}
            onNavigate={handleNavigate}
            onViewArticle={handleViewArticle}
            currentUser={currentUser ?? undefined}
          />
        )
      case 'about':
        return <AboutPage />
      case 'what-we-do':
        return <WhatWeDoPage />
      case 'map':
        return (
          <MapPage
            projects={filteredProjects}
            filters={filters}
            onFilterChange={handleFilterChange}
            filterOptions={filterOptions}
          />
        )
      case 'partner-with-us':
        return <PartnerPage />
      case 'news':
        return <ArticleListPage title="Latest News" items={publishedNews} onViewArticle={handleViewArticle} />
      case 'videos':
        return <ArticleListPage title="Videos" items={publishedVideos} onViewArticle={handleViewArticle} />
      case 'publications':
        return <ArticleListPage title="Publications" items={publishedPublications} onViewArticle={handleViewArticle} onIncrementDownload={handleIncrementDownloadCount} />
      default:
        return <Home
            projects={filteredProjects}
            onAddProject={handleAddProject}
            filters={filters}
            onFilterChange={handleFilterChange}
            filterOptions={filterOptions}
            activeView={activeView}
            setActiveView={setActiveView}
            newsData={publishedNews}
            publicationsData={publishedPublications}
            videosData={publishedVideos}
            onNavigate={handleNavigate}
            onViewArticle={handleViewArticle}
            currentUser={currentUser ?? undefined}
          />
    }
  }

  if (!mounted) return null
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminView && (
        <Header 
          activePage={activePage} 
          onNavigate={handleNavigate}
          currentUser={currentUser ?? undefined}
        />
      )}
      <main className="flex-grow">
        {renderContent()}
      </main>
      {!isAdminView && <Footer />}
    </div>
  )
}