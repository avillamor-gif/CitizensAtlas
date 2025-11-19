'use client'

import { useEffect, useState } from 'react'

export default function AuthTestPage() {
  const [envData, setEnvData] = useState<any>({})

  useEffect(() => {
    // Check environment variables client-side
    const data = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'undefined',
      hasLocalStorage: typeof window !== 'undefined',
      authToken: typeof window !== 'undefined' ? (localStorage.getItem('atlas-auth-token') ? 'EXISTS' : 'MISSING') : 'SERVER_SIDE',
      currentURL: typeof window !== 'undefined' ? window.location.href : 'server-side'
    }
    setEnvData(data)
  }, [])

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4">Environment Check</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(envData, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Quick Login Test</h2>
          <p className="text-gray-600 mb-4">
            Open the browser console and try logging in with admin credentials.
          </p>
          
          <button 
            onClick={() => {
              window.location.href = '/?showLogin=true'
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login Page
          </button>
          
          <button 
            onClick={() => {
              window.location.href = '/admin'
            }}
            className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Go to Admin Page
          </button>

          <button 
            onClick={() => {
              window.location.href = '/debug'
            }}
            className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Go to Debug Page
          </button>
        </div>
      </div>
    </div>
  )
}