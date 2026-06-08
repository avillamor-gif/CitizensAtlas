import React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: "Citizens' Atlas - Mapping False Solutions in Climate Action",
  description: "The Citizens' Atlas is a collaborative platform for mapping and documenting false solutions in circular economy and climate action. Discover citizen-led initiatives, research, and evidence-based analysis of environmental policies and corporate greenwashing.",
  keywords: "false solutions, circular economy, climate action, citizen initiatives, environmental justice, greenwashing, climate policy, sustainability, environmental activism",
  authors: [{ name: "Citizens' Atlas Team" }],
  creator: "Citizens' Atlas",
  publisher: "Citizens' Atlas",
  robots: "index, follow",
  openGraph: {
    title: "Citizens' Atlas - Mapping False Solutions in Climate Action",
    description: "A collaborative platform for mapping and documenting false solutions in circular economy and climate action.",
    url: "https://citizens-atlas.vercel.app",
    siteName: "Citizens' Atlas",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Citizens' Atlas - Mapping False Solutions in Climate Action",
    description: "A collaborative platform for mapping and documenting false solutions in circular economy and climate action.",
    creator: "@citizensatlas",
  },
  manifest: "/manifest.json",
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: "#0d234f",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
          crossOrigin="" 
        />
      </head>
      <body 
        className="bg-gray-50 font-sans min-h-screen"
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}