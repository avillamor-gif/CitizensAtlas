'use client'

import React from 'react'
import Link from 'next/link'

function ADBPage() {
  const investmentByCountry = [
    { country: 'India', amount: 8050.4 },
    { country: 'Indonesia', amount: 4183.32 },
    { country: 'China', amount: 1205.62 },
    { country: 'Pakistan', amount: 707.43 },
    { country: 'Maldives', amount: 154.66 },
    { country: 'Thailand', amount: 154.1 },
    { country: 'Sri Lanka', amount: 150 },
    { country: 'Vietnam', amount: 126 },
    { country: 'Philippines', amount: 1.575 },
  ]

  const adbProjects = [
    { name: 'India: SAEL Biomass Energy Project', country: 'India', amount: 7540.4 },
    { name: 'Indonesia: Sustainable and Inclusive Energy Program (Subprogram 1)', country: 'Indonesia', amount: 1350 },
    { name: 'Indonesia: Reducing Marine Debris Program, Subprogram 1', country: 'Indonesia', amount: 1150.22 },
    { name: 'Pakistan: Emergency Assistance for Fighting the COVID-19 Pandemic', country: 'Pakistan', amount: 526.43 },
    { name: 'China: Hunan Xiangjiang River Watershed Existing Solid Waste Treatment', country: 'China', amount: 258 },
    { name: 'China: AGRICULTURAL AND MUNICIPAL WASTE TO ENERGY PROJECT', country: 'China', amount: 200 },
    { name: 'Swachh Bharat Mission 2.0–Comprehensive Municipal Waste Management', country: 'India', amount: 203.5 },
    { name: 'ASEAN distributed power project Phase 2', country: 'Regional', amount: 235 },
    { name: 'Canvest Waste Management Project', country: 'China', amount: 184.8 },
    { name: 'Pakistan: Developing Resilient Environments and Advancing Municipal Services', country: 'Pakistan', amount: 181 },
    { name: 'China: Guangxi Zero-Waste City Development Program', country: 'China', amount: 150 },
    { name: 'Sri Lanka: Responsive COVID-19 Vaccines for Recovery Project', country: 'Sri Lanka', amount: 150 },
    { name: 'Maldives: Greater Male Waste-to-Energy Project', country: 'Maldives', amount: 143.89 },
    { name: 'Thailand: Cornerstone Investment in Leading Independent Power Producer', country: 'Thailand', amount: 120 },
    { name: 'South Tangerang Waste Management PPP Project', country: 'Indonesia', amount: 122.9 },
    { name: 'Southern Thailand Waste-to-Energy Project', country: 'Thailand', amount: 34.1 },
    { name: 'Indonesia: Alba Blue Loan for Recycling', country: 'Indonesia', amount: 44.2 },
    { name: 'Viet Nam: Binh Duong Waste Management and Energy Efficiency Project', country: 'Vietnam', amount: 26 },
  ]

  return (
    <article className="bg-white">
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
          <div className="text-xs uppercase tracking-[0.25em] text-gray-600 mb-3">IFI Profile</div>
          <h1 className="text-6xl mb-6">
            <span className="text-blue-600">ADB</span> · Asian Development Bank
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            A regional multilateral founded in the late 1960s by the United States and Japan. 68 member countries — 49 of them in the Asia-Pacific — with Japan and the US holding the most influential voting blocs.
          </p>

          <div className="space-y-4 border-t border-gray-200">
            <Stat label="False-solutions projects surveyed by GAIA AP" value="48" />
            <Stat label="Projects with Gender Action Plans" value="5 of 20" highlight />
            <Stat label="Stated climate-finance commitment by 2030" value="USD 100B+" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8">
        <div className="container mx-auto max-w-4xl">
          <Section title="Mandate and climate financing in Asia-Pacific">
            <p>
              ADB plays a central role in climate financing in Asia and the Pacific. It provides loans,
              technical assistance and partnership facilities for "renewable energy infrastructure",
              low-carbon urban development, and emissions reduction. In 2024 Reuters reported on ADB's
              goal of devoting 50% of annual lending to climate finance by 2030, aiming for over
              USD 100 billion between 2019 and 2030.
            </p>
            <p>
              Civil society groups, including GAIA AP, have raised concerns that some of these
              investments — waste-to-energy incineration, "repurposing" of coal plants, large hydropower,
              and fossil gas under a transition framing — are false solutions that perpetuate harm
              rather than enable a just transition. Despite relying on coal and non-renewable feedstock
              like wood and petrochemicals as inputs to WtE incineration, ADB has justified these as
              "renewable" energy.
            </p>
          </Section>

          <Section title="Interpreting ADB's database of false waste solutions">
            <p>
              GAIA AP surveyed 48 false-solutions projects. The vast majority are linked with or
              advocate for incineration with or without energy conversion, pyrolysis, or
              plastic-to-fuel. A minority endorse refuse-derived fuel and other specious recycling
              solutions. ADB's loan-heavy lending toward these projects adds materially to the debt
              burden of developing economies in the region.
            </p>
            <p>
              The Energy Transition Mechanism (ETM) is central to understanding ADB's waste financing
              mission. ADB presents ETM as a tool to retire or repurpose coal-fired power plants ahead
              of schedule, but critics argue its design — how "repurposing" is defined, who the
              financing partners are, and the absence of robust safeguards — may allow coal and
              polluting technologies to persist under the guise of transition.
            </p>
          </Section>

          <BarBlock title="ADB · Investment per country (USD millions)" data={investmentByCountry} />

          <section className="my-12">
            <h2 className="text-3xl font-bold mb-5 text-gray-900">Largest ADB projects in the database</h2>
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
                  {adbProjects.map((p) => (
                    <tr key={p.name} className="border-t border-gray-200 hover:bg-gray-100 transition">
                      <td className="px-4 py-3 text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600">{p.country}</td>
                      <td className="px-4 py-3 text-right text-blue-600 font-medium tabular-nums">{typeof p.amount === 'number' ? p.amount.toLocaleString() : p.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-12 rounded-lg p-6 border border-gray-200 bg-gray-50">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Read the policy brief</h3>
            <p className="text-gray-600 text-sm mb-4">
              For deeper findings on emissions, costs to communities, and the role of informal waste workers,
              read the ADB factsheet.
            </p>
            <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
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
      <h2 className="text-3xl font-bold mb-5 text-gray-900">{title}</h2>
      <div className="space-y-4 text-gray-700 leading-relaxed">{children}</div>
    </section>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between py-4 border-b border-gray-200">
      <span className="text-sm text-gray-600 uppercase tracking-wider">{label}</span>
      <span className={`text-3xl font-bold ${highlight ? 'text-blue-500' : 'text-blue-600'}`}>{value}</span>
    </div>
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

export default ADBPage
