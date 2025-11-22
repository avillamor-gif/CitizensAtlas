'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { PartnerPage } from '@/components/pages'
import { Page } from '@/types/types'
import { useAuth } from '@/contexts/AuthContext'

export const dynamic = 'force-dynamic'

export default function PartnerWithUs() {
  const router = useRouter()
  const { user: currentUser } = useAuth()

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
        <PartnerPage currentUser={currentUser ?? undefined} />
      </main>
      <Footer />
    </div>
  )
}