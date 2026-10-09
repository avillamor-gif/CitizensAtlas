'use client'

import React from 'react'
import Link from 'next/link'

function AiibPage() {
  const investmentByCountry = [
    { country: 'India', amount: 1001 },
    { country: 'Bangladesh', amount: 698 },
    { country: 'Pakistan', amount: 650 },
    { country: 'Philippines', amount: 500 },
    { country: 'Indonesia', amount: 210 },
    { country: 'Türkiye', amount: 173.764 },
    { country: 'Maldives', amount: 151.13 },
  ]

  const aiibProjects = [
    { name: 'India: Chennai City Partnership: Sustainable Urban Services Program', country: 'India', amount: 701 },
    { name: 'Pakistan: Khyber Pakhtunkhwa Cities Improvement Project', country: 'Pakistan', amount: 650 },
    { name: 'Multicountry: Everbright Infrastructure Investment Fund II', country: 'Multicountry', amount: 600 },
    { name: 'Philippines: Metro Manila Flood Management', country: 'Philippines', amount: 500 },
    { name: 'India: Kerala Solid Waste Management Project', country: 'India', amount: 300 },
    { name: 'Bangladesh Integrated Solid Waste Management Improvement Project', country: 'Bangladesh', amount: 231 },
    { name: 'Indonesia: Solid Waste Management for Sustainable Urban Development', country: 'Indonesia', amount: 210 },
    { name: 'Türkiye: Istanbul Seismic Mitigation and Emergency Preparedness', country: 'Türkiye', amount: 174.6 },
    { name: 'Maldives: Greater Malé Waste-to-Energy Project', country: 'Maldives', amount: 151.13 },
    { name: 'North Dhaka Waste to Energy Project', country: 'Bangladesh', amount: 467 },
  ]

  return (
    <article style={{ backgroundColor: 'var(--deep)' }}>
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
          <div className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: '#aeb9cc' }}>IFI Profile</div>
          <h1 className="text-6xl mb-6">
            <span style={{ color: 'var(--highlight)' }}>AIIB</span> · <span style={{ color: 'white' }}>Asian Infrastructure Investment Bank</span>
          </h1>
          <p className="text-lg leading-relaxed mb-6" style={{ color: '#aeb9cc' }}>
            Founded in 2016, initiated by China under the slogan "lean, clean and green." By mid-2024 it had 109 member countries, with China holding over a quarter of voting power.
          </p>

          <div className="space-y-4" style={{ borderTopColor: '#2f4059', borderTopWidth: '1px' }}>
            <Stat label="False-solutions projects surveyed by GAIA AP" value="10" />
            <Stat label="Projects with accountability concerns" value="8 of 10" highlight />
            <Stat label="PPM cases rejected" value="100%" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8">
        <div className="container mx-auto max-w-4xl">
          <Section title="False waste solutions and AIIB's WtE pattern">
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
          </Section>

          <BarBlock title="AIIB · Investment per country (USD millions)" data={investmentByCountry} />

          <section className="my-12">
            <h2 className="text-3xl font-bold mb-5 text-white">Largest AIIB projects in the database</h2>
            <div className="overflow-hidden rounded-lg border" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-widest" style={{ color: '#aeb9cc', backgroundColor: 'rgba(26, 95, 122, 0.2)', borderBottomColor: '#2f4059', borderBottomWidth: '1px' }}>
                    <th className="px-4 py-3 font-medium">Project</th>
                    <th className="px-4 py-3 font-medium">Country</th>
                    <th className="px-4 py-3 font-medium text-right">USD M</th>
                  </tr>
                </thead>
                <tbody>
                  {aiibProjects.map((p) => (
                    <tr key={p.name} className="transition" style={{ borderTopColor: '#2f4059', borderTopWidth: '1px' }}>
                      <td className="px-4 py-3" style={{ color: 'white' }}>{p.name}</td>
                      <td className="px-4 py-3" style={{ color: '#aeb9cc' }}>{p.country}</td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums" style={{ color: 'var(--highlight)' }}>{p.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-12 rounded-lg p-6 border" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
            <h3 className="text-2xl font-bold mb-2 text-white">Learn more about AIIB</h3>
            <p className="text-sm mb-4" style={{ color: '#aeb9cc' }}>
              For more information about AIIB's role in false solutions financing, see the Atlas.
            </p>
            <Link href="/" className="text-sm font-medium transition" style={{ color: 'var(--highlight)' }}>
              ← Back to overview
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold mb-5 text-white">{title}</h2>
      <div className="space-y-4 leading-relaxed" style={{ color: '#aeb9cc' }}>{children}</div>
    </section>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between py-4" style={{ borderBottomColor: '#2f4059', borderBottomWidth: '1px' }}>
      <span className="text-sm uppercase tracking-wider" style={{ color: '#aeb9cc' }}>{label}</span>
      <span className={`text-3xl font-bold`} style={{ color: 'var(--highlight)' }}>{value}</span>
    </div>
  )
}

function BarBlock({ title, data }: { title: string; data: { country: string; amount: number }[] }) {
  const max = Math.max(...data.map((d) => d.amount))
  return (
    <div className="my-12 rounded-lg p-6 border" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
      <div className="text-xs uppercase tracking-widest mb-5" style={{ color: '#aeb9cc' }}>{title}</div>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.country} className="grid grid-cols-[8rem_1fr_6rem] items-center gap-3 text-sm">
            <span style={{ color: '#aeb9cc' }}>{d.country}</span>
            <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(26, 95, 122, 0.3)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ background: 'linear-gradient(to right, #1a5f7a, var(--highlight))', width: `${(d.amount / max) * 100}%` }}
              />
            </div>
            <span className="text-right font-medium tabular-nums" style={{ color: '#aeb9cc' }}>{d.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AiibPage
