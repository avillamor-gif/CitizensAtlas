'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { ArticleDetailPage } from '@/components/features/articles'
import { Article } from '@/types/types'
import * as dataService from '@/lib/services/data-service'
import { buildSeoSlug, parseIdFromSlug, reconstructArticleSlugs } from '@/lib/utils/slug-utils'

export default function VideoDetailPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArticle = async () => {
      const rawSlug = params?.slug
      const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug
      const id = slug ? parseIdFromSlug(slug) : null

      if (!slug || id === null) {
        setLoading(false)
        return
      }

      try {
        const items = reconstructArticleSlugs(await dataService.getPublishedVideos())
        const match = items.find(item => item.id === id)

        if (match) {
          const canonicalSlug = buildSeoSlug(match.title, match.id)
          if (canonicalSlug !== slug) {
            router.replace(`/videos/${canonicalSlug}`)
            return
          }
        }

        setArticle(match || null)
      } catch (error) {
        console.error('Failed to load video:', error)
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
            <div className="text-brand-dark-blue text-lg font-semibold">Loading video...</div>
          </div>
        ) : article ? (
          <ArticleDetailPage article={article} onBack={() => router.push('/videos')} sourcePage="videos" />
        ) : (
          <div className="flex justify-center items-center py-24">
            <div className="text-center">
              <div className="text-brand-dark-blue text-lg font-semibold mb-4">Video not found.</div>
              <button onClick={() => router.push('/videos')} className="text-brand-light-blue hover:underline">
                Back to videos
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}