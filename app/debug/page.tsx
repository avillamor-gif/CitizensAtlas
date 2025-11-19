'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [status, setStatus] = useState<any>({})

  useEffect(() => {
    async function checkEnvironment() {
      try {
        // Check client-side environment variables
        const clientEnv = {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
        }

        // Test API endpoint
        const apiResponse = await fetch('/api/test')
        const apiData = await apiResponse.json()

        // Test data service
        let dataServiceResult
        try {
          const { getProjects } = await import('@/lib/services/data-service')
          const projects = await getProjects()
          dataServiceResult = {
            success: true,
            projectsCount: projects.length,
            sampleProjects: projects.slice(0, 3).map(p => ({
              id: p.id,
              title: p.title?.substring(0, 50) + '...',
              country: p.country
            }))
          }
        } catch (error: any) {
          dataServiceResult = {
            success: false,
            error: error.message
          }
        }

        setStatus({
          clientEnv,
          apiTest: apiData,
          dataService: dataServiceResult,
          timestamp: new Date().toISOString()
        })

      } catch (error: any) {
        setStatus({
          error: 'Failed to run checks',
          message: error.message
        })
      }
    }

    checkEnvironment()
  }, [])

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Status</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
        
        <div className="mt-6">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Check
          </button>
        </div>
      </div>
    </div>
  )
}