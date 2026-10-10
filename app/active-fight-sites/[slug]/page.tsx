'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { ProjectBrief } from '@/types/types'
import * as dataService from '@/lib/services/data-service'
import { projectBriefsToArticles } from '@/lib/utils/slug-utils'

const globalStyles = `
  .project-brief-content a {
    color: #dc2626 !important;
    text-decoration: underline !important;
  }
  .project-brief-content a:hover {
    color: #991b1b !important;
  }
`

function BriefFieldRow({
  label,
  value,
  highlight = false,
  isHtml = false,
  subtitle,
}: {
  label: string
  value: string
  highlight?: boolean
  isHtml?: boolean
  subtitle?: string
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 p-4 sm:p-6 border-b border-gray-700 hover:bg-gray-900/30 transition-colors`} style={{ backgroundColor: 'transparent' }}>
      <div className="md:col-span-1">
        <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wide text-gray-400`}>
          {label}
        </h3>
        {subtitle && <p className="text-xs italic text-gray-500 mt-1 lowercase">{subtitle}</p>}
      </div>
      <div className="md:col-span-2">
        {isHtml ? (
          <div
            className={`project-brief-content text-sm leading-relaxed prose prose-sm max-w-none text-gray-200`}
            style={{ wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <p className={`text-sm leading-relaxed text-gray-200`}>
            {value}
          </p>
        )}
      </div>
    </div>
  )
}

export default function ActiveFightSiteDetailPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const [brief, setBrief] = useState<ProjectBrief | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBrief = async () => {
      const rawSlug = params?.slug
      const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug

      if (!slug) {
        setLoading(false)
        return
      }

      try {
        const items = await dataService.getPublishedProjectBriefs()
        const briefsAsArticles = projectBriefsToArticles(items)
        const matchedArticle = briefsAsArticles.find(item => item.slug === slug)
        const match = matchedArticle ? items.find(item => item.id === matchedArticle.id) || null : null

        setBrief(match)
      } catch (error) {
        console.error('Failed to load active fight site:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBrief()
  }, [params])

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--deep)' }}>
      <style>{globalStyles}</style>
      <Header />
      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="text-white text-lg font-semibold">Loading active fight site...</div>
          </div>
        ) : brief ? (
          <>
            {/* Hero Section */}
            <section className="relative overflow-hidden text-white py-20 md:py-28 px-4 sm:px-8 border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.1)' }}>
              <div
                aria-hidden
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    'radial-gradient(ellipse at 20% 10%, rgba(100, 200, 255, 0.2), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(255, 165, 0, 0.1), transparent 55%)',
                }}
              />
              <div className="container mx-auto relative">
                <button
                  onClick={() => router.push('/active-fight-sites')}
                  className="mb-6 text-white border border-white hover:bg-white hover:text-gray-900 px-4 py-2 rounded-md transition-colors text-sm font-medium"
                >
                  ← Back to Active Fight Sites
                </button>
                <div className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3 flex items-center gap-3">
                  <span className="h-px w-10" style={{ backgroundColor: 'var(--highlight)' }} />
                  {brief.country || 'Active Fight Site'}
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl" style={{ color: 'white' }}>
                  {brief.project_name}
                </h1>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-3xl">
                  {brief.location && `Located in ${brief.location}`}
                </p>
                
                {/* Photo Gallery */}
                {brief.photos && brief.photos.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-6 text-white">Project Photos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {brief.photos.map((photo, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg aspect-video group">
                          <img
                            src={photo}
                            alt={`${brief.project_name} - Photo ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto py-8 sm:py-12 md:py-16 px-4">
              <div className="space-y-3">
                <div className="bg-transparent">
                  <div className="divide-y divide-gray-700 bg-transparent">
                    {brief.project_type && <BriefFieldRow label="Project Type" subtitle="(kind of energy project)" value={brief.project_type} />}
                    {brief.location && <BriefFieldRow label="Location" value={brief.location} />}
                    {brief.financing_amount && <BriefFieldRow label="Financing Amount" value={brief.financing_amount} />}
                    {brief.financiers && <BriefFieldRow label="Financiers" value={brief.financiers} />}
                    {brief.financial_instruments && <BriefFieldRow label="Financial Instruments" value={brief.financial_instruments} isHtml />}
                    {brief.other_partners_involved && <BriefFieldRow label="Other partners involved" value={brief.other_partners_involved} isHtml />}
                    {brief.timeline_and_status && <BriefFieldRow label="Timeline and Status" value={brief.timeline_and_status} isHtml />}
                    {brief.safeguard_categories && <BriefFieldRow label="Safeguard categories" value={brief.safeguard_categories} isHtml />}
                    {brief.negative_impacts && <BriefFieldRow label="Negative impacts of the project" value={brief.negative_impacts} isHtml />}
                    {brief.reprisals && <BriefFieldRow label="Reprisals associated with the project" subtitle="(including articles in the press)" value={brief.reprisals} isHtml />}
                    {brief.advocacy_timeline && <BriefFieldRow label="Short timeline of advocacy activities and response of the bank" subtitle="(CSO lobbying, community actions such as petitions to the local govt, bank, etc)" value={brief.advocacy_timeline} isHtml />}
                    {brief.other_information && <BriefFieldRow label="Any other information and links to project documents" value={brief.other_information} isHtml />}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center py-24">
            <div className="text-center">
              <div className="text-white text-lg font-semibold mb-4">Active Fight Site not found.</div>
              <button onClick={() => router.push('/active-fight-sites')} className="text-brand-light-blue hover:underline">
                Back to Active Fight Sites
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}