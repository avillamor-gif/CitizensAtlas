'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'
import { ProjectBrief } from '@/types/types'
import * as dataService from '@/lib/services/data-service'
import { projectBriefsToArticles } from '@/lib/utils/slug-utils'

function BriefCard({ brief, href }: { brief: ProjectBrief; href: string }) {
  
  const cardContent = (
    <div className="border-2 rounded-lg shadow-md transition-all duration-300 flex flex-col overflow-hidden h-full hover:shadow-xl cursor-pointer" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-xs font-bold px-2 py-1 inline-block mb-3 self-start rounded" style={{ backgroundColor: 'var(--highlight)', color: '#0a1628' }}>
          {brief.project_type || 'Project Brief'}
        </span>
        <h3 className="text-lg font-bold mb-2 flex-grow text-white">
          {brief.project_name}
        </h3>
        {brief.location && (
          <p className="text-sm mb-1" style={{ color: '#aeb9cc' }}>
            <span className="font-semibold">Location:</span> {brief.location}
          </p>
        )}
        {brief.country && (
          <p className="text-sm mb-1" style={{ color: '#aeb9cc' }}>
            <span className="font-semibold">Country:</span> {brief.country}
          </p>
        )}
        {!brief.country && (
          <p className="text-sm mb-1" style={{ color: '#ff6b6b' }}>
            <span className="font-semibold">⚠ Country not specified</span>
          </p>
        )}
        {brief.financing_amount && (
          <p className="text-sm mb-1" style={{ color: '#aeb9cc' }}>
            <span className="font-semibold">Financing:</span> {brief.financing_amount}
          </p>
        )}
        {brief.timeline_and_status && (
          <p className="text-sm mt-2 line-clamp-2" style={{ color: '#aeb9cc' }}>{brief.timeline_and_status}</p>
        )}
        <div className="mt-4 self-start">
          <span className="text-sm font-bold hover:underline transition-colors" style={{ color: '#64b5ff' }}>
            View Details &rarr;
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <Link href={href}>
      {cardContent}
    </Link>
  )
}

export default function ActiveFightSites() {
  const [briefs, setBriefs] = useState<ProjectBrief[]>([])
  const [loading, setLoading] = useState(true)

  const briefSlugById = React.useMemo(() => {
    const map = new Map<number, string>()
    for (const article of projectBriefsToArticles(briefs)) {
      map.set(article.id, article.slug)
    }
    return map
  }, [briefs])

  useEffect(() => {
    dataService.getPublishedProjectBriefs().then(setBriefs).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow" style={{ backgroundColor: 'var(--deep)' }}>
        {/* Header Section */}
        <section className="py-16 px-4 sm:px-8 text-white border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.1)' }}>
          <div className="container mx-auto">
            <div className="text-xs uppercase tracking-[0.32em] mb-4" style={{ color: '#aeb9cc' }}>Active Resistance</div>
            <h1 className="text-5xl font-bold mb-4">
              <span style={{ color: 'white' }}>Active Fight Sites</span>
            </h1>
            <p className="text-lg max-w-3xl" style={{ color: '#aeb9cc' }}>
              Communities around the world resisting false solutions — incinerators, chemical recycling plants, and greenwashed projects threatening their environments.
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="py-12 px-4 sm:px-8 lg:px-16">
          <div className="container mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="text-lg font-semibold" style={{ color: '#aeb9cc' }}>Loading active fight sites...</div>
              </div>
            ) : briefs.length === 0 ? (
              <div className="text-center py-24" style={{ color: '#aeb9cc' }}>No active fight sites found.</div>
            ) : (
              <>
                <p className="text-sm mb-6" style={{ color: '#aeb9cc' }}>{briefs.length} active fight site{briefs.length !== 1 ? 's' : ''}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {briefs.map(brief => (
                    <BriefCard key={brief.id} brief={brief} href={`/active-fight-sites/${briefSlugById.get(brief.id) || ''}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
