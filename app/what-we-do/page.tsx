'use client'

import React from 'react'
import { Header, Footer } from '@/components/layout'
import { WhatWeDoPage } from '@/components/pages'
import { useAuth } from '@/contexts/AuthContext'

export const dynamic = 'force-dynamic'

export default function WhatWeDo() {
  const { user: currentUser } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <WhatWeDoPage currentUser={currentUser ?? undefined} />
      </main>
      <Footer />
    </div>
  )
}