'use client'

import React, { useState, useEffect } from 'react'
import { Header, Footer } from '@/components/layout'
import { NewsPage, ArticleDetailPage } from '@/components/features/articles'
import { Article } from '@/types/types'
import * as dataService from '@/lib/services/data-service'

export default function News() {
  const [news, setNews] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  useEffect(() => {
    dataService.getPublishedNews().then(setNews).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (selectedArticle) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <ArticleDetailPage
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
            sourcePage="news"
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
            <div className="text-brand-dark-blue text-lg font-semibold">Loading news...</div>
          </div>
        ) : (
          <NewsPage items={news} onViewArticle={setSelectedArticle} />
        )}
      </main>
      <Footer />
    </div>
  )
}