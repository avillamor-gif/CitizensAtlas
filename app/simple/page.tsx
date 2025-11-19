'use client'

import React from 'react'

export default function SimplePage() {
  return (
    <div className="flex flex-col min-h-screen p-8">
      <h1 className="text-3xl font-bold text-brand-dark-blue">
        Citizens Atlas - Next.js Migration
      </h1>
      <div className="mt-8">
        <p className="text-lg text-gray-700">
          The app has been successfully migrated from Vite to Next.js!
        </p>
        <div className="mt-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Next.js App Router structure implemented<br/>
            ✅ Professional file organization completed<br/>
            ✅ TypeScript configuration updated<br/>
            ✅ Tailwind CSS configured<br/>
            ✅ Import paths restructured with aliases
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Migration Benefits:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Better SEO with Server-Side Rendering</li>
            <li>Automatic code splitting and optimization</li>
            <li>Professional component organization</li>
            <li>Enhanced development experience</li>
            <li>Built-in performance optimizations</li>
          </ul>
        </div>
      </div>
    </div>
  )
}