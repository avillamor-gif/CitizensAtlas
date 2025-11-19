'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { PartnerPage } from '@/components/pages'
import { Page } from '@/types/types'

export const dynamic = 'force-dynamic'

export default function PartnerWithUs() {
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
        activePage="partner-with-us"
        onNavigate={handleNavigate}
      />
      <main className="flex-grow">
        <PartnerPage />
      </main>
      <Footer />
    </div>
  )
}