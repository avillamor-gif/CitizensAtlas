'use client'

import React from 'react'
import { Header, Footer } from '@/components/layout'
import { ADBPage } from '@/components/pages'

export const dynamic = 'force-dynamic'

export default function ADB() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <ADBPage />
      </main>
      <Footer />
    </div>
  )
}
