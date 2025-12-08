'use client'

import React from 'react'
import { Header, Footer } from '@/components/layout'
import { useRouter } from 'next/navigation'

export default function ProjectBriefsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  
  const handleNavigate = (page: string) => {
    // Navigate using Next.js router
    router.push(`/?page=${page}`)
  }

  return (
    <>
      <Header 
        activePage={'project-briefs' as any}
        onNavigate={handleNavigate}
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  )
}
