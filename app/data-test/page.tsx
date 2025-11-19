'use client'

import { useEffect, useState } from 'react'

export default function DataTestPage() {
  const [testResults, setTestResults] = useState<any>({})

  useEffect(() => {
    async function testDataLoading() {
      try {
        // Test 1: Environment variables
        const envCheck = {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
        }

        // Test 2: Direct Supabase API call
        let directApiTest = {}
        try {
          const response = await fetch('https://srsjynjccivtjvordrlc.supabase.co/rest/v1/projects?select=id,title,status&limit=3', {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2p5bmpjY2l2dGp2b3JkcmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMDE3NjUsImV4cCI6MjA3Mzc3Nzc2NX0.YOyYebTJSgq0bEcBQDXsNCiK6WPvB8lViSKtquzkdGE'
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            directApiTest = { success: true, count: data.length, sample: data }
          } else {
            directApiTest = { success: false, status: response.status, error: await response.text() }
          }
        } catch (error) {
          directApiTest = { success: false, error: (error as Error).message }
        }

        // Test 3: Data service
        let dataServiceTest = {}
        try {
          const { getPublishedProjects } = await import('@/lib/services/data-service')
          const projects = await getPublishedProjects()
          dataServiceTest = { success: true, count: projects.length, sample: projects.slice(0, 3) }
        } catch (error) {
          dataServiceTest = { success: false, error: (error as Error).message }
        }

        setTestResults({
          envCheck,
          directApiTest,
          dataServiceTest,
          timestamp: new Date().toISOString()
        })

      } catch (error) {
        setTestResults({
          error: 'Test failed',
          message: (error as Error).message
        })
      }
    }

    testDataLoading()
  }, [])

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Data Loading Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          <pre className="text-xs overflow-x-auto bg-gray-100 p-4 rounded">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>

        <div className="mt-6 space-x-4">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Test
          </button>
          <button 
            onClick={() => window.location.href = '/admin'} 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Go to Admin
          </button>
          <button 
            onClick={() => window.location.href = '/'} 
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  )
}