import React from 'react'

export default function ResourcesPage() {
  return (
    <main style={{ backgroundColor: 'var(--deep)' }} className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--highlight)' }}>Resources</h1>
      <p className="mb-6" style={{ color: '#aeb9cc' }}>A curated collection of reports, guides and useful links related to the Citizens' Atlas.</p>

      <section className="space-y-4">
        <article className="p-4 rounded-lg" style={{ borderColor: '#2f4059', borderWidth: '2px', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
          <h2 className="font-semibold text-white">Research & Reports</h2>
          <p className="text-sm" style={{ color: '#aeb9cc' }}>Key research and analysis on false solutions to climate and circularity.</p>
        </article>

        <article className="p-4 rounded-lg" style={{ borderColor: '#2f4059', borderWidth: '2px', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
          <h2 className="font-semibold text-white">Guides</h2>
          <p className="text-sm" style={{ color: '#aeb9cc' }}>How to contribute, verify sources, and use the map and datasets.</p>
        </article>

        <article className="p-4 rounded-lg" style={{ borderColor: '#2f4059', borderWidth: '2px', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
          <h2 className="font-semibold text-white">External Links</h2>
          <p className="text-sm" style={{ color: '#aeb9cc' }}>Links to partner organizations and further reading.</p>
        </article>
      </section>
    </main>
  )
}
