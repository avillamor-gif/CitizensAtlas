'use client'

import React from 'react'
import { Header, Footer } from '@/components/layout'
import { JicaPage } from '@/components/pages'

export const dynamic = 'force-dynamic'

export default function JICA() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <JicaPage />
      </main>
      <Footer />
    </div>
  )
}
