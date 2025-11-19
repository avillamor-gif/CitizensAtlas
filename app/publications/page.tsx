'use client'

import React from 'react'
import { Header, Footer } from '@/components/layout'
import { ArticleListPage } from '@/components/features/articles'

// This would need proper implementation with data fetching
export default function Publications() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        activePage="publications"
        onNavigate={() => {}}
      />
      <main className="flex-grow">
        <div className="p-8">
          <h1 className="text-2xl font-bold">Publications</h1>
          <p>This page would contain the publications.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}