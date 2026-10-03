'use client'

import React from 'react'
import Link from 'next/link'

function WbgPage() {
  const investmentByCountry = [
    { country: 'China', amount: 2460.2 },
    { country: 'India', amount: 2287.86 },
    { country: 'Pakistan', amount: 1945 },
    { country: 'Philippines', amount: 1250 },
    { country: 'Indonesia', amount: 1164 },
    { country: 'Bangladesh', amount: 375 },
    { country: 'Vietnam', amount: 314 },
    { country: 'Sri Lanka', amount: 303 },
  ]

  const wbgProjects = [
    { name: 'Engro Corporation partnership for Plastic Recycling', country: 'Pakistan', amount: 1800 },
    { name: 'Swachh Bharat Mission Support Operation', country: 'India', amount: 1500 },
    { name: 'CIF ACT Investment Plan for the Republic of the Philippines', country: 'Philippines', amount: 500 },
    { name: 'CIF Accelerating Coal Transition (ACT): Indonesia Country Investment Plan', country: 'Indonesia', amount: 500 },
    { name: 'Philippines Second Sustainable Recovery Development Policy Loan', country: 'Philippines', amount: 750 },
    { name: 'Program to Support Development of Renewable Bioenergy in India', country: 'India', amount: 650 },
    { name: 'China Plastic Waste Reduction Project', country: 'China', amount: 616.74 },
    { name: 'China Plastic Waste Reduction Project (Shaanxi)', country: 'China', amount: 393.75 },
    { name: 'Sustainable Microenterprise and Resilient Transformation (SMART)', country: 'India', amount: 375 },
    { name: 'Canvest WTE', country: 'China', amount: 374.16 },
    { name: 'BaF Vietnam Agri', country: 'Vietnam', amount: 352.7 },
    { name: 'Indonesia Local Service Delivery Improvement Project', country: 'Indonesia', amount: 350 },
    { name: 'Indonesia Local Service Delivery Improvement Project', country: 'Indonesia', amount: 300 },
    { name: 'Gansu Linxia Low Carbon Urban Development and Transport Project', country: 'China', amount: 282 },
    { name: 'Sri Lanka Emergency Solid Waste Management Project (ESWMP)', country: 'Sri Lanka', amount: 274 },
    { name: 'SeABank Green Blue Gender', country: 'Vietnam', amount: 225 },
    { name: 'DCM VPB Sustainability Bond', country: 'Vietnam', amount: 200 },
    { name: 'Solid Waste and Plastic Management Improvement Project', country: 'Bangladesh', amount: 67.3 },
  ]

  const wbgComponents = [
    { code: 'IBRD', desc: 'International Bank for Reconstruction and Development — lends to middle-income countries.' },
    { code: 'IDA', desc: 'International Development Association — concessional finance to low-income countries.' },
    { code: 'IFC', desc: 'International Finance Corporation — supports private-sector investment.' },
  ]

  return (
    <article className="bg-white">
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
          <div className="text-xs uppercase tracking-[0.25em] text-gray-600 mb-3">IFI Profile</div>
          <h1 className="text-6xl mb-6">
            <span className="text-blue-600">WBG</span> · World Bank Group
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            One of the most influential multilateral financial institutions shaping global development priorities. Established in 1944, governed by 189 member countries, dominated by the US, Japan, Germany, France, the UK, and China — with the United States holding de facto veto power.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8">
        <div className="container mx-auto max-w-4xl">
          <section className="my-12">
            <h2 className="text-3xl font-bold mb-5 text-gray-900">Composition</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {wbgComponents.map((b) => (
                <div key={b.code} className="rounded-lg p-5 border border-gray-200 bg-gray-50">
                  <div className="text-2xl font-bold mb-2 text-blue-600">{b.code}</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="my-12">
            <h2 className="text-3xl font-bold mb-5 text-gray-900">WBG's false-solutions trends</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                WBG's recent portfolio, as tracked in the database, reveals a troubling pattern of
                promoting false solutions to environmental and waste crises. The Bank publicly emphasises
                "just transition" and "circular economy" goals, but continues to fund waste-to-energy
                plants, advanced plastic recycling projects, and waste-to-roads initiatives. These
                technologies have been criticised for perpetuating fossil fuel dependence and undermining
                the hierarchy of priorities in waste management — beginning with reduction.
              </p>
              <p>
                Its growing interest in plastic circularity, especially marine plastics, is also a point
                of concern for GAIA, given the proliferation of techno-fixes that reinforce the
                industrial waste systems they claim to address.
              </p>
            </div>
          </section>

          <section className="my-12">
            <h2 className="text-3xl font-bold mb-5 text-gray-900">Reporting inconsistencies</h2>
            <p className="text-gray-700 leading-relaxed">
              The WBG applies a dual risk system, categorising projects as "high" to "moderate", while
              the IFC uses letter ratings — most often "B" (limited). These coexist confusingly: a
              project may be listed as "Environmental Category: B" yet "Environmental and Social Risk:
              Not applicable." It is rarely transparent what criteria trigger the shift from "moderate"
              to "high." The Bac Ninh WTE plant illustrates this contradiction: despite being rated
              "B – limited," IFC documents acknowledge the economic displacement of 116 households,
              health and safety risks, and historical groundwater and soil pollution — impacts that
              clearly exceed "limited" risk.
            </p>
          </section>

          <BarBlock title="WBG · Investment per country (USD millions)" data={investmentByCountry} />

          <section className="my-12">
            <h2 className="text-3xl font-bold mb-5 text-gray-900">Largest WBG projects in the database</h2>
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
                  {wbgProjects.map((p) => (
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

export default WbgPage
