import React from 'react'

export default function ResourcesPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Resources</h1>
      <p className="text-gray-700 mb-6">A curated collection of reports, guides and useful links related to the Citizens' Atlas.</p>

      <section className="space-y-4">
        <article className="p-4 border rounded-lg">
          <h2 className="font-semibold">Research & Reports</h2>
          <p className="text-sm text-gray-600">Key research and analysis on false solutions to climate and circularity.</p>
        </article>

        <article className="p-4 border rounded-lg">
          <h2 className="font-semibold">Guides</h2>
          <p className="text-sm text-gray-600">How to contribute, verify sources, and use the map and datasets.</p>
        </article>

        <article className="p-4 border rounded-lg">
          <h2 className="font-semibold">External Links</h2>
          <p className="text-sm text-gray-600">Links to partner organizations and further reading.</p>
        </article>
      </section>
    </main>
  )
}
