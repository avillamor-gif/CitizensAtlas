'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { ArticleListPage } from '@/components/features/articles'
import { Page } from '@/types/types'

// This would need proper implementation with data fetching
export default function News() {
  const router = useRouter()

  const handleNavigate = (page: Page) => {
    if (page === 'home') {
      router.push('/')
    } else {
      router.push(`/${page}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        activePage="news"
        onNavigate={handleNavigate}
      />
      <main className="flex-grow">
        <div className="p-8">
          <h1 className="text-2xl font-bold">Latest News</h1>
          <p>This page would contain the news articles.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}