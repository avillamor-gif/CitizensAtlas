'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProjectBrief } from '@/types/types'
import * as DataService from '@/lib/services/data-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Add global styles for links in project briefs
const globalStyles = `
  .project-brief-content a {
    color: #dc2626 !important;
    text-decoration: underline !important;
  }
  .project-brief-content a:hover {
    color: #991b1b !important;
  }
`

// Helper function to parse currency
const parseCurrency = (currencyString: string): number => {
  if (!currencyString) return 0
  const numberString = currencyString.replace(/[$,€]/g, '').replace(/,/g, '')
  return parseFloat(numberString) || 0
}

// Format amount for display
const formatAmount = (num: number) => {
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`
  return `$${num.toLocaleString()}`
}

function CountryProjectBriefsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const country = searchParams?.get('country') || ''
  
  const [briefs, setBriefs] = useState<ProjectBrief[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBrief, setSelectedBrief] = useState<ProjectBrief | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchBriefs = async () => {
      if (!country) {
        setError('No country specified')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Fetch published project briefs (no auth required)
        const allBriefs = await DataService.getPublishedProjectBriefs()
        
        // Filter by country (case-insensitive)
        const countryBriefs = allBriefs.filter(
          b => b.country?.toUpperCase() === country.toUpperCase()
        )
        
        setBriefs(countryBriefs)
      } catch (err) {
        console.error('Error fetching project briefs:', err)
        setError('Failed to load project briefs')
      } finally {
        setLoading(false)
      }
    }

    fetchBriefs()
  }, [country])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark-blue mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading project briefs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <Button onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </div>
    )
  }

  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 font-medium mb-4">No country specified</p>
          <Button onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </div>
    )
  }

  // Calculate total investment
  const totalInvestment = briefs.reduce((sum, brief) => {
    const amount = parseCurrency(brief.financing_amount || '')
    return sum + amount
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{globalStyles}</style>
      {/* Page Header */}
      <div className="bg-brand-dark-blue text-white px-4 sm:px-8 text-center min-h-[300px] flex flex-col justify-center items-center">
        <div>
          <h1 className="text-5xl font-extrabold mb-4">
            {country.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())} Project Briefs
          </h1>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/map')}
            className="mt-4 text-white border-2 border-white hover:bg-white hover:text-brand-dark-blue"
          >
            ← Back to Map
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-4">
        {briefs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 text-base sm:text-lg">No published project briefs found for {country}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {briefs.map((brief) => {
              return (
                <div key={brief.id} className="space-y-3">
                  <div className="space-y-2">
                    <div className="inline-block bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-wider">
                      {brief.country}
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black uppercase leading-tight w-full md:w-1/2">
                      {brief.project_name}
                    </h2>
                  </div>
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardHeader className="bg-white p-6 sm:p-8 hidden">
                    </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200">
                      {/* Project Type & Location */}
                      {brief.project_type && (
                        <BriefFieldRow label="Project Type" subtitle="(kind of energy project)" value={brief.project_type} />
                      )}
                      
                      {brief.location && (
                        <BriefFieldRow label="Location" value={brief.location} />
                      )}

                      {/* Financing Amount */}
                      {brief.financing_amount && (
                        <BriefFieldRow 
                          label="Financing Amount" 
                          value={brief.financing_amount}
                        />
                      )}
                      
                      {/* Financiers */}
                      {brief.financiers && (
                        <BriefFieldRow label="Financiers" value={brief.financiers} />
                      )}

                      {/* Financial Instruments */}
                      {brief.financial_instruments && (
                        <BriefFieldRow 
                          label="Financial Instruments" 
                          value={brief.financial_instruments}
                          isHtml
                        />
                      )}

                      {/* Partners */}
                      {brief.other_partners_involved && (
                        <BriefFieldRow 
                          label="Other partners involved" 
                          value={brief.other_partners_involved}
                          isHtml
                        />
                      )}

                      {/* Timeline */}
                      {brief.timeline_and_status && (
                        <BriefFieldRow 
                          label="Timeline and Status" 
                          value={brief.timeline_and_status}
                          isHtml
                        />
                      )}

                      {/* Safeguards */}
                      {brief.safeguard_categories && (
                        <BriefFieldRow 
                          label="Safeguard categories" 
                          value={brief.safeguard_categories}
                          isHtml
                        />
                      )}

                      {/* Negative Impacts */}
                      {brief.negative_impacts && (
                        <BriefFieldRow 
                          label="Negative impacts of the project" 
                          value={brief.negative_impacts}
                          isHtml
                        />
                      )}

                      {/* Reprisals */}
                      {brief.reprisals && (
                        <BriefFieldRow 
                          label="Reprisals associated with the project" 
                          subtitle="(including articles in the press)"
                          value={brief.reprisals}
                          isHtml
                        />
                      )}

                      {/* Advocacy Timeline */}
                      {brief.advocacy_timeline && (
                        <BriefFieldRow 
                          label="Short timeline of advocacy activities and response of the bank" 
                          subtitle="(CSO lobbying, community actions such as petitions to the local govt, bank, etc)"
                          value={brief.advocacy_timeline}
                          isHtml
                        />
                      )}

                      {/* Other Information */}
                      {brief.other_information && (
                        <BriefFieldRow 
                          label="Any other information and links to project documents" 
                          value={brief.other_information}
                          isHtml
                        />
                      )}
                    </div>
                  </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}

// Two-column row component for brief fields
function BriefFieldRow({ 
  label, 
  value, 
  highlight = false,
  isHtml = false,
  subtitle
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
        {subtitle && (
          <p className="text-xs italic text-gray-500 mt-1 lowercase">
            {subtitle}
          </p>
        )}
      </div>
      <div className="md:col-span-2">
        {isHtml ? (
          <div 
            className={`project-brief-content text-sm leading-relaxed prose prose-sm max-w-none ${highlight ? 'text-blue-900 font-semibold' : 'text-gray-900'}`}
            style={{
              wordBreak: 'break-word'
            }}
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

// Main component with Suspense wrapper
export default function CountryProjectBriefsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark-blue mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <CountryProjectBriefsContent />
    </Suspense>
  )
}
