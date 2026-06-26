'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { ArticleDetailPage } from '@/components/features/articles'
import { Article } from '@/types/types'
import * as dataService from '@/lib/services/data-service'
import { reconstructArticleSlugs } from '@/lib/utils/slug-utils'

export default function NewsDetailPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArticle = async () => {
      const rawSlug = params?.slug
      const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug

      if (!slug) {
        setLoading(false)
        return
      }

      try {
        const items = reconstructArticleSlugs(await dataService.getPublishedNews())
        const match = items.find(item => item.slug === slug)

        setArticle(match || null)
      } catch (error) {
        console.error('Failed to load news article:', error)
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [params, router])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="text-brand-dark-blue text-lg font-semibold">Loading news article...</div>
          </div>
        ) : article ? (
          <ArticleDetailPage article={article} onBack={() => router.push('/news')} sourcePage="news" />
        ) : (
          <div className="flex justify-center items-center py-24">
            <div className="text-center">
              <div className="text-brand-dark-blue text-lg font-semibold mb-4">Article not found.</div>
              <button onClick={() => router.push('/news')} className="text-brand-light-blue hover:underline">
                Back to news
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}