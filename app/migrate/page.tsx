'use client'

import React, { useState } from 'react'
import { migrateLocalStorageToSupabase } from '@/lib/services/migrate-to-supabase'

export default function MigratePage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleMigrate = async () => {
    setStatus('running')
    setError(null)
    
    try {
      const migrationResults = await migrateLocalStorageToSupabase()
      setResults(migrationResults)
      setStatus('success')
    } catch (err: any) {
      setError(err.message || 'Migration failed')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Migrate Data to Supabase
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                This will copy all data from localStorage (Projects, News, Publications, Videos) 
                to your Supabase database. This is a one-time operation.
              </p>
            </div>
            
            {status === 'idle' && (
              <div className="mt-5">
                <button
                  onClick={handleMigrate}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Start Migration
                </button>
              </div>
            )}
            
            {status === 'running' && (
              <div className="mt-5">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-sm text-gray-700">Migrating data...</span>
                </div>
              </div>
            )}
            
            {status === 'success' && results && (
              <div className="mt-5">
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Migration completed!
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Projects: {results.projects.success} migrated {results.projects.failed > 0 && `(${results.projects.failed} failed)`}</li>
                          <li>News: {results.news.success} migrated {results.news.failed > 0 && `(${results.news.failed} failed)`}</li>
                          <li>Publications: {results.publications.success} migrated {results.publications.failed > 0 && `(${results.publications.failed} failed)`}</li>
                          <li>Videos: {results.videos.success} migrated {results.videos.failed > 0 && `(${results.videos.failed} failed)`}</li>
                        </ul>
                      </div>
                      <div className="mt-4">
                        <a href="/" className="text-sm font-medium text-green-800 hover:text-green-900">
                          Return to Home →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {status === 'error' && (
              <div className="mt-5">
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Migration failed
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => setStatus('idle')}
                          className="text-sm font-medium text-red-800 hover:text-red-900"
                        >
                          Try again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 What this does:</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Reads all data from browser localStorage</li>
            <li>Copies each item to your Supabase database</li>
            <li>Preserves all data including status, categories, and metadata</li>
            <li>Does not delete localStorage data (you can do that manually after verifying)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
