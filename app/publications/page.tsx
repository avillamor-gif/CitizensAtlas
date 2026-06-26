'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { PublicationsPage } from '@/components/features/articles'
import { Article } from '@/types/types'
import * as dataService from '@/lib/services/data-service'
import { reconstructArticleSlugs } from '@/lib/utils/slug-utils'

export default function Publications() {
  const [publications, setPublications] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    dataService.getPublishedPublications().then(items => setPublications(reconstructArticleSlugs(items))).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleIncrementDownload = (articleId: number) => {
    setPublications(prev =>
      prev.map(pub =>
        pub.id === articleId ? { ...pub, downloadCount: (pub.downloadCount || 0) + 1 } : pub
      )
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="text-brand-dark-blue text-lg font-semibold">Loading publications...</div>
          </div>
        ) : (
          <PublicationsPage
            items={publications}
            onViewArticle={(article) => router.push(`/publications/${article.slug}`)}
            onIncrementDownload={handleIncrementDownload}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}