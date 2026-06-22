'use client'

import React from 'react'
import { Header, Footer } from '@/components/layout'
import { AboutPage } from '@/components/pages'

export const dynamic = 'force-dynamic'

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <AboutPage />
      </main>
      <Footer />
    </div>
  )
}