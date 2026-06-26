'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { NewsPage } from '@/components/features/articles'
import { Article } from '@/types/types'
import * as dataService from '@/lib/services/data-service'
import { reconstructArticleSlugs } from '@/lib/utils/slug-utils'

export default function News() {
  const [news, setNews] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    dataService.getPublishedNews().then(items => setNews(reconstructArticleSlugs(items))).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="text-brand-dark-blue text-lg font-semibold">Loading news...</div>
          </div>
        ) : (
          <NewsPage items={news} onViewArticle={(article) => router.push(`/news/${article.slug}`)} />
        )}
      </main>
      <Footer />
    </div>
  )
}