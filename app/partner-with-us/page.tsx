'use client'

import React from 'react'
import { Header, Footer } from '@/components/layout'
import { PartnerPage } from '@/components/pages'

export const dynamic = 'force-dynamic'

export default function PartnerWithUs() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <PartnerPage />
      </main>
      <Footer />
    </div>
  )
}