'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { VideosPage } from '@/components/features/articles'
import { Article } from '@/types/types'
import * as dataService from '@/lib/services/data-service'
import { reconstructArticleSlugs } from '@/lib/utils/slug-utils'

export default function Videos() {
  const [videos, setVideos] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    dataService.getPublishedVideos().then(items => setVideos(reconstructArticleSlugs(items))).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="text-brand-dark-blue text-lg font-semibold">Loading videos...</div>
          </div>
        ) : (
          <VideosPage items={videos} onViewArticle={(article) => router.push(`/videos/${article.slug}`)} />
        )}
      </main>
      <Footer />
    </div>
  )
}
