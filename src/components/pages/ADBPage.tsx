'use client'

import React from 'react'
import Link from 'next/link'

function ADBPage() {
  const investmentByCountry = [
    { country: 'Indonesia', amount: 850 },
    { country: 'Philippines', amount: 720 },
    { country: 'Vietnam', amount: 580 },
    { country: 'Thailand', amount: 450 },
    { country: 'Pakistan', amount: 380 },
  ]

  return (
    <article className="bg-white">
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
          <div className="text-xs uppercase tracking-[0.25em] text-gray-600 mb-3">IFI Profile</div>
          <h1 className="text-6xl mb-6">
            <span className="text-blue-600">ADB</span> · Asian Development Bank
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-12">
            A regional multilateral founded in the late 1960s by the United States and Japan. 68 member
            countries — 49 of them in the Asia-Pacific — with Japan and the US holding the most
            influential voting blocs.
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
