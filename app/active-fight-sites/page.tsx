'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'
import { ProjectBrief } from '@/types/types'
import * as dataService from '@/lib/services/data-service'

function BriefCard({ brief }: { brief: ProjectBrief }) {
  // Only make card clickable if country exists
  const hasCountry = brief.country && brief.country.trim()
  const href = hasCountry ? `/country-project-briefs?country=${encodeURIComponent(brief.country || '')}` : '#'
  
  const cardContent = (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-md transition-all duration-300 flex flex-col overflow-hidden h-full ${hasCountry ? 'hover:shadow-xl hover:border-brand-light-blue cursor-pointer' : 'opacity-75'}`}>
      <div className="p-6 flex flex-col flex-grow">
        <span className="bg-yellow-400 text-xs font-bold px-2 py-1 inline-block mb-3 self-start">
          {brief.project_type || 'Project Brief'}
        </span>
        <h3 className="text-lg font-bold text-brand-dark-blue mb-2 flex-grow">
          {brief.project_name}
        </h3>
        {brief.location && (
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-semibold">Location:</span> {brief.location}
          </p>
        )}
        {brief.country && (
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-semibold">Country:</span> {brief.country}
          </p>
        )}
        {!brief.country && (
          <p className="text-sm text-red-500 mb-1">
            <span className="font-semibold">⚠ Country not specified</span>
          </p>
        )}
        {brief.financing_amount && (
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-semibold">Financing:</span> {brief.financing_amount}
          </p>
        )}
        {brief.timeline_and_status && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{brief.timeline_and_status}</p>
        )}
        {hasCountry && (
          <div className="mt-4 self-start">
            <span className="text-sm font-bold text-brand-light-blue hover:underline">
              View Details &rarr;
            </span>
          </div>
        )}
      </div>
    </div>
  )
  
  if (!hasCountry) {
    return cardContent
  }
  
  return (
    <Link href={href}>
      {cardContent}
    </Link>
  )
}

export default function ActiveFightSites() {
  const [briefs, setBriefs] = useState<ProjectBrief[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dataService.getPublishedProjectBriefs().then(setBriefs).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Blue banner */}
        <div className="bg-brand-dark-blue text-white px-4 sm:px-8 text-center min-h-[300px] flex flex-col justify-center items-center">
          <div>
            <h1 className="text-5xl font-extrabold mb-4">Active Fight Sites</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Communities around the world resisting false solutions — incinerators, chemical recycling plants, and greenwashed projects threatening their environments.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white py-12 px-4 sm:px-8 lg:px-16">
          <div className="container mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="text-brand-dark-blue text-lg font-semibold">Loading active fight sites...</div>
              </div>
            ) : briefs.length === 0 ? (
              <div className="text-center py-24 text-gray-500">No active fight sites found.</div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-6">{briefs.length} active fight site{briefs.length !== 1 ? 's' : ''}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {briefs.map(brief => (
                    <BriefCard key={brief.id} brief={brief} />
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
