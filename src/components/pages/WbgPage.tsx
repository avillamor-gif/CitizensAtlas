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
    { country: 'Malaysia', amount: 123 },
    { country: 'Cambodia', amount: 67.3 },
    { country: 'Lao People\'s Democratic Republic', amount: 45.08 },
    { country: 'Papua New Guinea', amount: 15 },
  ]

  const wbgProjects = [
    { name: 'Engro Corporation partnership for Plastic Recycling', country: 'Pakistan', amount: 1800 },
    { name: 'Swachh Bharat Mission Support Operation', country: 'India', amount: 1500 },
    { name: 'Philippines Second Sustainable Recovery Development Policy Loan', country: 'Philippines', amount: 750 },
    { name: 'CIF ACT Investment Plan for the Republic of the Philippines', country: 'Philippines', amount: 500 },
    { name: 'CIF Accelerating Coal Transition (ACT): Indonesia Country Investment Plan', country: 'Indonesia', amount: 500 },
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
    { name: 'Canvest Corporate Loan', country: 'China', amount: 150 },
    { name: 'Intco Recycling', country: 'China', amount: 123 },
    { name: 'SRF 2022 loan', country: 'China', amount: 112 },
    { name: 'Solid Waste Emergency and Efficiency Project', country: 'India', amount: 105 },
    { name: 'ALBA Asia', country: 'China', amount: 100 },
    { name: 'Dynagreen Chinese Waste-to-Energy Portfolio', country: 'China', amount: 100 },
    { name: 'BGE Green Bond', country: 'China', amount: 94.63 },
    { name: 'Ji an Waste-to-Energy Plant', country: 'China', amount: 94.44 },
    { name: 'Plastic free Rivers and Seas for South Asia', country: 'Regional', amount: 50 },
    { name: 'Siyang County household Waste-to-Energy plant', country: 'China', amount: 51.89 },
    { name: 'Shandong Qixia Waste-to-Energy and Heating Plant', country: 'China', amount: 53.67 },
    { name: 'Solid Waste and Plastic Management Improvement Project', country: 'Cambodia', amount: 67.3 },
    { name: 'Yijun County Waste-to-Energy plant', country: 'China', amount: 44.48 },
    { name: 'Linshu WTE Plant', country: 'China', amount: 40.03 },
    { name: 'Lao PDR Pollution and Waste Management Project', country: "Lao People's Democratic Republic", amount: 45.08 },
    { name: 'Bac Ninh WTE plant', country: 'Vietnam', amount: 74 },
    { name: 'Solid Waste and Plastic Management Improvement Project', country: 'Bangladesh', amount: 67.3 },
    { name: 'Pakistan Finance for Lowering Emissions in the Water and Waste Sectors', country: 'Pakistan', amount: 40 },
    { name: 'SKC VN project (biodegradable plastics)', country: 'Vietnam', amount: 40 },
    { name: 'Circulate Capital Ocean Fund I-B', country: 'Regional', amount: 36 },
    { name: 'CH GEF Municipal Solid Waste Management Project', country: 'China', amount: 32.91 },
    { name: 'Huaiyuan Integrated Biomass and Waste-to-Energy Project', country: 'China', amount: 31.28 },
    { name: 'RENEWGEN ENVIRONMENT PROTECTION KOTTE PVT LTD WTE plant', country: 'Sri Lanka', amount: 29 },
    { name: 'Southeast Asia Regional Program on Combating Marine Plastics (SEA-MaP)', country: 'Regional', amount: 20 },
    { name: 'Healthspring', country: 'India', amount: 20 },
    { name: 'TWM Roku', country: 'India', amount: 15 },
    { name: '2 Projects funded by the PWR linked bond including SEArcular, Surabaya', country: 'Indonesia', amount: 14 },
    { name: 'India Climate Change Mitigation Action Support', country: 'India', amount: 5.2 },
    { name: 'Chennai WTE plant', country: 'India', amount: 0.664 },
    { name: 'Guolong Client Upstream Support', country: 'China', amount: 0.2242 },
  ]

  const wbgComponents = [
    { code: 'IBRD', desc: 'International Bank for Reconstruction and Development — lends to middle-income countries.' },
    { code: 'IDA', desc: 'International Development Association — concessional finance to low-income countries.' },
    { code: 'IFC', desc: 'International Finance Corporation — supports private-sector investment.' },
  ]

  return (
    <article style={{ backgroundColor: 'var(--deep)' }}>
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
          <div className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: '#aeb9cc' }}>IFI Profile</div>
          <h1 className="text-6xl mb-6">
            <span style={{ color: 'var(--highlight)' }}>WBG</span> · <span style={{ color: 'white' }}>World Bank Group</span>
          </h1>
          <p className="text-lg leading-relaxed mb-6" style={{ color: '#aeb9cc' }}>
            One of the most influential multilateral financial institutions shaping global development priorities. Established in 1944, governed by 189 member countries, dominated by the US, Japan, Germany, France, the UK, and China — with the United States holding de facto veto power.
          </p>

          <div className="space-y-4" style={{ borderTopColor: '#2f4059', borderTopWidth: '1px' }}>
            <Stat label="False-solutions projects surveyed by GAIA AP" value="48" />
            <Stat label="Projects with accountability concerns" value="15 of 48" highlight />
            <Stat label="WBG components tracked" value="3" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8">
        <div className="container mx-auto max-w-4xl">
          <Section title="Composition">
            <div className="grid md:grid-cols-3 gap-4">
              {wbgComponents.map((b) => (
                <div key={b.code} className="rounded-lg p-5 border" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
                  <div className="text-2xl font-bold mb-2" style={{ color: 'var(--highlight)' }}>{b.code}</div>
                  <p className="text-sm leading-relaxed" style={{ color: '#aeb9cc' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="WBG's false-solutions trends">
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
          </Section>

          <Section title="Reporting inconsistencies">
            <p>
              The WBG applies a dual risk system, categorising projects as "high" to "moderate", while
              the IFC uses letter ratings — most often "B" (limited). These coexist confusingly: a
              project may be listed as "Environmental Category: B" yet "Environmental and Social Risk:
              Not applicable." It is rarely transparent what criteria trigger the shift from "moderate"
              to "high." The Bac Ninh WTE plant illustrates this contradiction: despite being rated
              "B – limited," IFC documents acknowledge the economic displacement of 116 households,
              health and safety risks, and historical groundwater and soil pollution — impacts that
              clearly exceed "limited" risk.
            </p>
          </Section>

          <BarBlock title="WBG · Investment per country (USD millions)" data={investmentByCountry} />

          <section className="my-12">
            <h2 className="text-3xl font-bold mb-5 text-white">Largest WBG projects in the database</h2>
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
                  {wbgProjects.map((p) => (
                    <tr key={p.name} className="transition" style={{ borderTopColor: '#2f4059', borderTopWidth: '1px' }}>
                      <td className="px-4 py-3" style={{ color: 'white' }}>{p.name}</td>
                      <td className="px-4 py-3" style={{ color: '#aeb9cc' }}>{p.country}</td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums" style={{ color: 'var(--highlight)' }}>{typeof p.amount === 'number' ? p.amount.toLocaleString() : p.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-12 rounded-lg p-6 border" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
            <h3 className="text-2xl font-bold mb-2 text-white">Learn more about WBG</h3>
            <p className="text-sm mb-4" style={{ color: '#aeb9cc' }}>
              For more information about the World Bank Group's role in false solutions financing, see the Atlas.
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

export default WbgPage
