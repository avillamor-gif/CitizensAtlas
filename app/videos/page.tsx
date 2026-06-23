'use client'

import React, { useState, useEffect } from 'react'
import { Header, Footer } from '@/components/layout'
import { VideosPage, ArticleDetailPage } from '@/components/features/articles'
import { Article } from '@/types/types'
import * as dataService from '@/lib/services/data-service'

export default function Videos() {
  const [videos, setVideos] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Article | null>(null)

  useEffect(() => {
    dataService.getPublishedVideos().then(setVideos).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (selectedVideo) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <ArticleDetailPage
            article={selectedVideo}
            onBack={() => setSelectedVideo(null)}
            sourcePage="videos"
          />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="text-brand-dark-blue text-lg font-semibold">Loading videos...</div>
          </div>
        ) : (
          <VideosPage items={videos} onViewArticle={setSelectedVideo} />
        )}
      </main>
      <Footer />
    </div>
  )
}
