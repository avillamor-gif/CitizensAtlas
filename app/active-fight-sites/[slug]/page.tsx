'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { ProjectBrief } from '@/types/types'
import * as dataService from '@/lib/services/data-service'
import { buildSeoSlug, parseIdFromSlug } from '@/lib/utils/slug-utils'

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
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 p-4 sm:p-6 ${highlight ? 'bg-blue-50' : ''}`}>
      <div className="md:col-span-1">
        <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wide ${highlight ? 'text-blue-700' : 'text-gray-700'}`}>
          {label}
        </h3>
        {subtitle && <p className="text-xs italic text-gray-500 mt-1 lowercase">{subtitle}</p>}
      </div>
      <div className="md:col-span-2">
        {isHtml ? (
          <div
            className={`project-brief-content text-sm leading-relaxed prose prose-sm max-w-none ${highlight ? 'text-blue-900 font-semibold' : 'text-gray-900'}`}
            style={{ wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <p className={`text-sm leading-relaxed ${highlight ? 'text-blue-900 font-bold md:text-lg' : 'text-gray-900'}`}>
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
      const id = slug ? parseIdFromSlug(slug) : null

      if (!slug || id === null) {
        setLoading(false)
        return
      }

      try {
        const items = await dataService.getPublishedProjectBriefs()
        const match = items.find(item => item.id === id) || null

        if (match) {
          const canonicalSlug = buildSeoSlug(match.project_name, match.id)
          if (canonicalSlug !== slug) {
            router.replace(`/active-fight-sites/${canonicalSlug}`)
            return
          }
        }

        setBrief(match)
      } catch (error) {
        console.error('Failed to load active fight site:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBrief()
  }, [params, router])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <style>{globalStyles}</style>
      <Header />
      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="text-brand-dark-blue text-lg font-semibold">Loading active fight site...</div>
          </div>
        ) : brief ? (
          <>
            <div className="bg-brand-dark-blue text-white px-4 sm:px-8 text-center min-h-[300px] flex flex-col justify-center items-center">
              <div>
                <div className="inline-block bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-wider mb-4">
                  {brief.country || 'Active Fight Site'}
                </div>
                <h1 className="text-4xl sm:text-5xl font-black uppercase leading-tight max-w-5xl">
                  {brief.project_name}
                </h1>
                <button
                  onClick={() => router.push('/active-fight-sites')}
                  className="mt-6 text-white border-2 border-white hover:bg-white hover:text-brand-dark-blue px-4 py-2 rounded-md transition-colors"
                >
                  Back to Active Fight Sites
                </button>
              </div>
            </div>

            <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-4">
              <div className="space-y-3">
                <div className="bg-transparent">
                  <div className="divide-y divide-gray-200 bg-white rounded-lg overflow-hidden shadow-sm">
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
              <div className="text-brand-dark-blue text-lg font-semibold mb-4">Active Fight Site not found.</div>
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