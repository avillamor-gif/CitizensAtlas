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
    <article style={{ backgroundColor: 'var(--deep)' }}>
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
          <div className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: '#aeb9cc' }}>IFI Profile</div>
          <h1 className="text-6xl mb-6">
            <span style={{ color: 'var(--highlight)' }}>JICA</span> · <span style={{ color: 'white' }}>Japan International Cooperation Agency</span>
          </h1>
          <p className="text-lg leading-relaxed mb-6" style={{ color: '#aeb9cc' }}>
            A bilateral aid agency established in 1954 dedicated to Japan's Official Development Assistance (ODA). Provides development cooperation including technical assistance, loans, and grants, primarily in Asia-Pacific and African regions.
          </p>

          <div className="space-y-4" style={{ borderTopColor: '#2f4059', borderTopWidth: '1px' }}>
            <Stat label="False-solutions projects surveyed by GAIA AP" value="5" />
            <Stat label="Focus regions" value="Asia-Pacific" highlight />
            <Stat label="Bilateral agency" value="Yes" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8">
        <div className="container mx-auto max-w-4xl">
          <Section title="JICA's Development Assistance Approach">
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
          </Section>

          <Section title="Disclosure and Accountability">
            <p>
              JICA's disclosure practices are more limited compared to other major development finance institutions.
              Project information, environmental and social assessments, and grievance mechanisms are not consistently
              publicly available. This creates challenges for civil society monitoring and community participation in
              decision-making processes.
            </p>
          </Section>

          <BarBlock title="JICA · Investment per country (USD millions)" data={investmentByCountry} />

          <div className="mt-12 rounded-lg p-6 border" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
            <h3 className="text-2xl font-bold mb-2 text-white">Learn more about JICA</h3>
            <p className="text-sm mb-4" style={{ color: '#aeb9cc' }}>
              For more information about JICA's role in false solutions financing, see the Atlas.
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

export default JicaPage
