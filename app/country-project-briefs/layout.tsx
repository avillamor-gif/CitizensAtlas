'use client'

import React from 'react'
import { Header, Footer } from '@/components/layout'

export default function ProjectBriefsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  )
}
