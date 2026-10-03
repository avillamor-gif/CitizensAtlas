'use client'

import React from 'react'
import { Header, Footer } from '@/components/layout'
import { AiibPage } from '@/components/pages'

export const dynamic = 'force-dynamic'

export default function AIIB() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <AiibPage />
      </main>
      <Footer />
    </div>
  )
}
