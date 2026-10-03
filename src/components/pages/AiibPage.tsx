'use client'

import React from 'react'
import Link from 'next/link'

function AiibPage() {
  const investmentByCountry = [
    { country: 'Bangladesh', amount: 520 },
    { country: 'India', amount: 680 },
    { country: 'Indonesia', amount: 450 },
    { country: 'Philippines', amount: 380 },
    { country: 'Vietnam', amount: 290 },
  ]

  const aiibProjects = [
    { name: 'North Dhaka Waste-to-Energy Project', country: 'Bangladesh', amount: 100 },
    { name: 'Jakarta Integrated Waste Management', country: 'Indonesia', amount: 85 },
    { name: 'Manila WtE Facility', country: 'Philippines', amount: 75 },
    { name: 'Ho Chi Minh City Waste Infrastructure', country: 'Vietnam', amount: 65 },
    { name: 'Kolkata Incineration Project', country: 'India', amount: 95 },
  ]

  return (
    <article className="bg-white">
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
          <div className="text-xs uppercase tracking-[0.25em] text-gray-600 mb-3">IFI Profile</div>
          <h1 className="text-6xl mb-6">
            <span className="text-blue-600">AIIB</span> · Asian Infrastructure Investment Bank
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-12">
            Founded in 2016, initiated by China under the slogan "lean, clean and green." By mid-2024
            it had 109 member countries, with China holding over a quarter of voting power.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8">
        <div className="container mx-auto max-w-4xl">
          <section className="my-12">
            <h2 className="text-3xl font-bold mb-5 text-gray-900">False waste solutions and AIIB's WtE pattern</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Although AIIB claims to support green and sustainable infrastructure, its portfolio
                increasingly includes waste-to-energy projects that critics argue are false solutions. The
                North Dhaka Waste-to-Energy Project in Bangladesh is emblematic: AIIB approved
                USD 100 million non-sovereign financing in 2025 for a multi-line incineration facility to
                "reduce landfill waste and generate renewable energy." The ESIA identifies displacement
                of ragpickers, land acquisition, and air-pollutant emissions likely to exceed safe baseline
                thresholds.
              </p>
              <p>
                This is critical because AIIB's accountability mechanism — the Project-affected People's
                Mechanism (PPM), operational since 2019 — has been criticised as ineffective. Recourse
                reports that the PPM has rejected every case filed to it so far. Complaints are often
                ruled ineligible because projects are co-financed, or because project-level grievance
                mechanisms must be exhausted first. Draft revisions in 2024 do not fully address concerns
                around retaliation, eligibility, or self-initiated cases — urgent gaps given that 8 of 10
                assessed projects are active or proposed.
              </p>
            </div>
          </section>

          <BarBlock title="AIIB · Investment per country (USD millions)" data={investmentByCountry} />

          <section className="my-12">
            <h2 className="text-3xl font-bold mb-5 text-gray-900">Largest AIIB projects in the database</h2>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-widest text-gray-600 bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3 font-medium">Project</th>
                    <th className="px-4 py-3 font-medium">Country</th>
                    <th className="px-4 py-3 font-medium text-right">USD M</th>
                  </tr>
                </thead>
                <tbody>
                  {aiibProjects.map((p) => (
                    <tr key={p.name} className="border-t border-gray-200 hover:bg-gray-100 transition">
                      <td className="px-4 py-3 text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600">{p.country}</td>
                      <td className="px-4 py-3 text-right text-blue-600 font-medium tabular-nums">{p.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

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

export default AiibPage
