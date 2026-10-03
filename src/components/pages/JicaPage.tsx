'use client'

import React from 'react'
import Link from 'next/link'

function JicaPage() {
  const investmentByCountry = [
    { country: 'Philippines', amount: 280 },
    { country: 'Vietnam', amount: 240 },
    { country: 'Indonesia', amount: 220 },
    { country: 'Bangladesh', amount: 190 },
    { country: 'India', amount: 170 },
  ]

  return (
    <article className="bg-white">
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
          <div className="text-xs uppercase tracking-[0.25em] text-gray-600 mb-3">IFI Profile</div>
          <h1 className="text-6xl mb-6">
            <span className="text-blue-600">JICA</span> · Japan International Cooperation Agency
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            A bilateral aid agency established in 1954 dedicated to Japan's Official Development Assistance (ODA). Provides development cooperation including technical assistance, loans, and grants, primarily in Asia-Pacific and African regions.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8">
        <div className="container mx-auto max-w-4xl">
          <section className="my-12">
            <h2 className="text-3xl font-bold mb-5 text-gray-900">JICA's Development Assistance Approach</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                JICA is Japan's primary vehicle for delivering Official Development Assistance (ODA). As a bilateral
                agency, it operates with limited transparency compared to multilateral institutions. JICA's portfolio
                includes infrastructure development, environmental management, and waste management projects across
                Asia-Pacific.
              </p>
              <p>
                Civil society organizations have raised concerns about JICA-funded projects, including waste-to-energy
                facilities, that may not adequately address local environmental and social impacts or community
                engagement standards.
              </p>
            </div>
          </section>

          <section className="my-12">
            <h2 className="text-3xl font-bold mb-5 text-gray-900">Disclosure and Accountability</h2>
            <p className="text-gray-700 leading-relaxed">
              JICA's disclosure practices are more limited compared to other major development finance institutions.
              Project information, environmental and social assessments, and grievance mechanisms are not consistently
              publicly available. This creates challenges for civil society monitoring and community participation in
              decision-making processes.
            </p>
          </section>

          <BarBlock title="JICA · Investment per country (USD millions)" data={investmentByCountry} />

          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
            ← Back to overview
          </Link>
        </div>
      </section>
    </article>
  )
}

function BarBlock({ title, data }: { title: string; data: { country: string; amount: number }[] }) {
  const max = Math.max(...data.map((d) => d.amount))
  return (
    <div className="my-12 rounded-lg p-6 border border-gray-200 bg-gray-50">
      <div className="text-xs uppercase tracking-widest text-gray-600 mb-5">{title}</div>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.country} className="grid grid-cols-[8rem_1fr_6rem] items-center gap-3 text-sm">
            <span className="text-gray-600">{d.country}</span>
            <div className="h-2 rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                style={{ width: `${(d.amount / max) * 100}%` }}
              />
            </div>
            <span className="text-right text-gray-700 font-medium">{d.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JicaPage
