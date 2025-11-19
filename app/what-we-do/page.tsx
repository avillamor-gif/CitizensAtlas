'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { WhatWeDoPage } from '@/components/pages'
import { Page } from '@/types/types'

export const dynamic = 'force-dynamic'

export default function WhatWeDo() {
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
        activePage="what-we-do"
        onNavigate={handleNavigate}
      />
      <main className="flex-grow">
        <WhatWeDoPage />
      </main>
      <Footer />
    </div>
  )
}