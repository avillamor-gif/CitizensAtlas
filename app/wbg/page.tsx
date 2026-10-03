'use client'

import React from 'react'
import { Header, Footer } from '@/components/layout'
import { WbgPage } from '@/components/pages'

export const dynamic = 'force-dynamic'

export default function WBG() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <WbgPage />
      </main>
      <Footer />
    </div>
  )
}
