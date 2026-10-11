'use client'

import React from 'react'
import Link from 'next/link'

const trackedTechnologies = [
  'Waste-to-energy (WTE) incineration, including the burning of mixed, organic and medical waste',
  'Refuse-derived fuel (RDF)',
  'Advanced and chemical plastic recycling',
  'Plastic and carbon credit schemes',
  'Bioplastics',
  'Carbon capture on landfills',
]

const falseSolutions = [
  {
    title: 'Waste-to-Energy (WtE)',
    description: 'Thermal technologies — mass burn, pyrolysis, gasification, plasma arc — that incinerate municipal solid waste and biomass. Highly polluting and costly regardless of "advancements".',
  },
  {
    title: 'Plastic-to-Fuel',
    description: 'Pyrolysis, gasification and plasma arc applications. Unsustainable, polluting, and justifies continued plastic production.',
  },
  {
    title: 'Chemical Recycling',
    description: 'Framed as innovative but fails to tackle plastic pollution at the source — essentially converts plastic into another fossil fuel to be burned.',
  },
  {
    title: 'Refuse-Derived Fuel (RDF)',
    description: 'Pellets, bricks or fluff made of waste, burned in cement kilns and WtE plants. Contributes toxic air pollution and hazardous ash.',
  },
  {
    title: 'Plastic & carbon credit schemes',
    description: 'Offsetting frameworks that allow continued overproduction while claiming neutrality.',
  },
  {
    title: 'Bioplastics',
    description: 'Often non-biodegradable in practice, requiring industrial composting infrastructure that rarely exists.',
  },
  {
    title: 'Carbon capture on landfills',
    description: 'Carbon capture, utilisation and storage approaches grafted onto existing waste systems.',
  },
]

const trackedInstitutions = [
  { code: 'ADB', name: 'Asian Development Bank', desc: null },
  { code: 'AIIB', name: 'Asian Infrastructure Investment Bank', desc: null },
  { code: 'WBG', name: 'World Bank Group', desc: 'primarily IBRD and IFC' },
  { code: 'JICA', name: 'Japan International Cooperation Agency', desc: null },
]

const limitations = [
  {
    n: '01',
    title: 'Development-finance data is not consistently reported',
    body: [
      'The IFIs surveyed use different systems for environmental and social risk classification and disclose different types of information. This makes direct comparison difficult.',
      'For example, ADB uses A–C classifications across environment, involuntary resettlement and Indigenous Peoples, while Technical Assistance projects generally do not receive any consolidated ratings. The World Bank, IFC, and IBRD use different risk-classification systems, and AIIB uses a consolidated A–C environmental and social classification. JICA\'s disclosure and rating practices are limited and highly variable. Projects with apparently comparable technologies, scales, or impacts can be classified differently, while some projects contain contradictory risk ratings. These features themselves are relevant to understanding how development finance institutions assess waste projects.',
      'These classifications are not direct equivalents to project risk and are to be clearly distinguished from GAIA\'s own assessment.',
    ],
  },
  {
    n: '02',
    title: 'The database does not capture every project document',
    body: [
      'Some projects have scores of publicly available documents, sometimes 50 or more. While the Atlas team has reviewed and revised the data in multiple rounds, it has not been possible to examine every document for every project.',
      'The Atlas represents a fair, but necessarily selective reading of the available evidence. Project entries should be read alongside the underlying documents, particularly where users need to conduct advocacy or due diligence.',
    ],
  },
  {
    n: '03',
    title: 'Absence of information is not evidence of absence',
    body: [
      'Where issues such as waste-picker livelihoods, resettlement, or gendered impacts, are not mentioned, this does not necessarily mean they do not exist. This likely reflects disclosure gaps in IFIs\' risk frameworks.',
    ],
  },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3 flex items-center gap-3">
      <span className="h-px w-10" style={{ backgroundColor: 'var(--highlight)' }} />
      {children}
    </div>
  )
}

const AboutPage: React.FC = () => {
  const [isMoneyFlowExpanded, setIsMoneyFlowExpanded] = React.useState(false)
  
  return (
    <div style={{ backgroundColor: 'var(--deep)' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white py-20 md:py-28 px-4 sm:px-8">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at 20% 10%, rgba(100, 200, 255, 0.2), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(255, 165, 0, 0.1), transparent 55%)',
          }}
        />
        <div className="container mx-auto relative">
          <SectionLabel>About the Atlas</SectionLabel>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: '72px', lineHeight: '73px', marginBottom: '2rem' }}>
            Tracking false solutions. Making finance <span style={{ color: '#ffa51d' }}>accountable.</span> Strengthening community <span style={{ color: '#ffa51d' }}>voices</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
            The climate crisis demands urgent action—but urgency cannot come at the expense of accountability. Investments made today can lock communities and countries into development pathways for decades. As governments and International Financial Institutions (IFIs) promote climate action, circular economy and a just transition, we must ask: is their money accelerating the transition—or deepening the crisis?
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mb-12">
            Public and IFI finance can support infrastructure that perpetuates extraction, consumption and disposal, including incineration, waste-to-energy (WTE), chemical and advanced recycling, carbon capture and other false solutions. For peoples' movements, the questions are: Who finances it? Who profits? Who bears the costs? What gets locked in? And whose solutions are displaced? Financing capital intensive waste technologies in the Global South while neglecting prevention, reuse, repair, recycling, composting and waste-worker livelihoods risks reinforcing waste colonialism and inequality.
          </p>

          {/* Two Column Section */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Column 1 */}
            <div>
              <h3 className="text-2xl font-normal mb-6" style={{ color: 'var(--highlight)' }}>
                Every data represents a community at risk.
              </h3>
              <p className="text-base leading-relaxed" style={{ color: '#aeb9cc' }}>
                The Citizens' Atlas of False Solutions and Circularity responds by mapping IFI  projects, technologies, policies and financial flows promoted as climate or circular solutions. Building on the Global Atlas of Environmental Justice, it connects financial data with community experiences, impacts, campaigns, complaints, legal actions and reprisals, showing who finances projects, what they claim to achieve, and what alternatives they may displace.
              </p>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="text-2xl font-normal mb-6" style={{ color: 'var(--highlight)' }}>
                A wealth of evidence for countering greenwashing
              </h3>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#aeb9cc' }}>
                The Atlas is an open citizen reporting and evidence platform, enabling communities, workers, researchers and civil society to report projects, impacts, threats and reprisals—including intimidation, harassment, surveillance, criminalization and displacement—with appropriate verification, privacy and security safeguards. It will connect struggles across countries, support collaborative action, and share expert views, research and publications that challenge misleading climate and circularity narratives.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#aeb9cc' }}>
                Ultimately, the Atlas turns financial data and community stories into evidence, accountability and collective action—making visible who benefits, who bears the costs, what gets locked in, and whose solutions are being ignored.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* False Solutions Section */}
      <section className="py-16 px-4 sm:px-8 text-white border-t" style={{ borderColor: 'rgba(255, 165, 0, 0.1)', backgroundColor: '#00071b' }}>
        <div className="container mx-auto">
          <SectionLabel>
            <span className="text-white">What we mean by</span>
          </SectionLabel>
          <h2 className="text-5xl font-normal mb-12 max-w-3xl">False solutions.</h2>
          
          <div className="mb-12 max-w-4xl">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              A false solution presents itself as addressing the waste and plastic crisis but in practice fails to tackle — and often exacerbates — its root causes: overproduction, overconsumption, and the absence of systemic commitments. They preserve the status quo while creating new environmental and social harms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {falseSolutions.map((solution, idx) => (
              <div
                key={idx}
                className="rounded-lg p-6 border h-full"
                style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}
              >
                <h3 className="font-normal text-lg mb-3" style={{ color: 'var(--highlight)' }}>
                  {solution.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Section */}
      <section className="py-16 px-4 sm:px-8 text-white border-t" style={{ borderColor: 'rgba(255, 165, 0, 0.1)', backgroundColor: '#00112b' }}>
        <div className="container mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <SectionLabel>Who we track</SectionLabel>
              <h2 className="text-4xl font-normal max-w-2xl">What does the Atlas track?</h2>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              The Atlas currently tracks projects supported by four major financial institutions.
              The database will expand in future to include projects supported by GIZ and KOICA.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {trackedInstitutions.map((i) => (
              <Link href={`/${i.code.toLowerCase()}`} key={i.code}>
                <div
                  className="rounded-lg p-6 h-full cursor-pointer transition-all duration-300 border group"
                  style={{ 
                    borderColor: '#2f4059',
                    backgroundColor: 'rgba(26, 95, 122, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ffa51d';
                    const readProfile = e.currentTarget.querySelector('[data-read-profile]');
                    if (readProfile) {
                      (readProfile as HTMLElement).style.color = '#ffa51d';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#2f4059';
                    const readProfile = e.currentTarget.querySelector('[data-read-profile]');
                    if (readProfile) {
                      (readProfile as HTMLElement).style.color = '#92a1b3';
                    }
                  }}
                >
                  <div className="font-normal mb-4" style={{ color: '#ffa51d', fontFamily: 'Fraunces', fontWeight: 400, fontSize: '36px' }}>
                    {i.code}
                  </div>
                  <div className="text-white font-medium leading-snug text-base mb-3">{i.name}</div>
                  {i.code === 'ADB' && (
                    <div className="text-gray-400 text-sm mb-4 leading-relaxed">
                      68 member countries · Japan & US most influential
                    </div>
                  )}
                  {i.code === 'AIIB' && (
                    <div className="text-gray-400 text-sm mb-4 leading-relaxed">
                      109 members · China holds {">"} 25% voting power
                    </div>
                  )}
                  {i.code === 'WBG' && (
                    <div className="text-gray-400 text-sm mb-4 leading-relaxed">
                      189 members · US holds de facto veto
                    </div>
                  )}
                  {i.code === 'JICA' && (
                    <div className="text-gray-400 text-sm mb-4 leading-relaxed">
                      Bilateral aid agency · minimal disclosure
                    </div>
                  )}
                  <div className="text-xs font-medium transition-colors" data-read-profile style={{ color: '#92a1b3' }}>
                    READ PROFILE →
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-6">
              <p className="text-gray-300 leading-relaxed max-w-3xl flex-grow">
                These bodies often work with national and municipal governments, state-owned entities,
                and corporations. Their involvement can take many forms, including loans, equity,
                grants, technical assistance, guarantees, and other financial instruments.
              </p>
              <button
                onClick={() => setIsMoneyFlowExpanded(!isMoneyFlowExpanded)}
                className="mt-1 px-4 py-2 rounded-lg font-normal text-sm transition-all duration-200 flex-shrink-0 whitespace-nowrap"
                style={{
                  backgroundColor: isMoneyFlowExpanded ? 'var(--highlight)' : '#112649',
                  color: isMoneyFlowExpanded ? '#020e21' : '#c5ced9',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isMoneyFlowExpanded) {
                    e.currentTarget.style.backgroundColor = '#0e2141'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMoneyFlowExpanded) {
                    e.currentTarget.style.backgroundColor = '#112649'
                  }
                }}
              >
                Where the money goes?
              </button>
            </div>

            {/* Expandable Section */}
            {isMoneyFlowExpanded && (
              <div className="rounded-lg p-6 border transition-all duration-300 max-w-4xl" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
                <p className="text-gray-300 leading-relaxed mb-8 max-w-3xl">
                  Across three banks, the database accounts for over USD 30 billion in false-solutions financing. India usually leads — closely followed by China as the second-highest destination of World Bank false-solutions investment.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="rounded-lg p-6 border" style={{ borderColor: '#2f4059', backgroundColor: '#0d1b2a' }}>
                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">ADB total</div>
                    <div className="text-4xl font-normal" style={{ color: 'var(--highlight)' }}>~$15.3 B</div>
                  </div>
                  <div className="rounded-lg p-6 border" style={{ borderColor: '#2f4059', backgroundColor: '#0d1b2a' }}>
                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">WBG total</div>
                    <div className="text-4xl font-normal" style={{ color: 'var(--highlight)' }}>~$11.0 B</div>
                  </div>
                  <div className="rounded-lg p-6 border" style={{ borderColor: '#2f4059', backgroundColor: '#0d1b2a' }}>
                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">AIIB total</div>
                    <div className="text-4xl font-normal" style={{ color: 'var(--highlight)' }}>~$4.0 B</div>
                  </div>
                </div>

                <div className="my-8 rounded-lg p-6 border" style={{ borderColor: '#2f4059', backgroundColor: '#0d1b2a' }}>
                  <div className="text-xs uppercase tracking-widest mb-5" style={{ color: '#aeb9cc' }}>ADB · Investment per country (USD M)</div>
                  <div className="space-y-2">
                    {[
                      { country: 'India', amount: 8050.4 },
                      { country: 'Indonesia', amount: 4183.32 },
                      { country: 'China', amount: 1205.62 },
                      { country: 'Pakistan', amount: 707.43 },
                      { country: 'Maldives', amount: 154.66 },
                      { country: 'Thailand', amount: 154.1 },
                      { country: 'Sri Lanka', amount: 150 },
                      { country: 'Vietnam', amount: 126 },
                      { country: 'Philippines', amount: 1.575 },
                    ].map((d, idx) => {
                      const max = 8050.4;
                      return (
                        <div key={idx} className="grid grid-cols-[8rem_1fr_6rem] items-center gap-3 text-sm">
                          <span style={{ color: '#aeb9cc' }}>{d.country}</span>
                          <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(26, 95, 122, 0.3)' }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ background: 'linear-gradient(to right, #1a5f7a, var(--highlight))', width: `${(d.amount / max) * 100}%` }}
                            />
                          </div>
                          <span className="text-right font-medium tabular-nums" style={{ color: '#aeb9cc' }}>{d.amount.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="my-8 rounded-lg p-6 border" style={{ borderColor: '#2f4059', backgroundColor: '#0d1b2a' }}>
                  <div className="text-xs uppercase tracking-widest mb-5" style={{ color: '#aeb9cc' }}>World Bank Group · Investment per country (USD M)</div>
                  <div className="space-y-2">
                    {[
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
                    ].map((d, idx) => {
                      const max = 2460.2;
                      return (
                        <div key={idx} className="grid grid-cols-[8rem_1fr_6rem] items-center gap-3 text-sm">
                          <span style={{ color: '#aeb9cc' }}>{d.country}</span>
                          <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(26, 95, 122, 0.3)' }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ background: 'linear-gradient(to right, #1a5f7a, var(--highlight))', width: `${(d.amount / max) * 100}%` }}
                            />
                          </div>
                          <span className="text-right font-medium tabular-nums" style={{ color: '#aeb9cc' }}>{d.amount.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="my-8 rounded-lg p-6 border" style={{ borderColor: '#2f4059', backgroundColor: '#0d1b2a' }}>
                  <div className="text-xs uppercase tracking-widest mb-5" style={{ color: '#aeb9cc' }}>AIIB · Investment per country (USD M)</div>
                  <div className="space-y-2">
                    {[
                      { country: 'India', amount: 1001 },
                      { country: 'Bangladesh', amount: 698 },
                      { country: 'Pakistan', amount: 650 },
                      { country: 'Philippines', amount: 500 },
                      { country: 'Indonesia', amount: 210 },
                      { country: 'Türkiye', amount: 173.764 },
                      { country: 'Maldives', amount: 151.13 },
                    ].map((d, idx) => {
                      const max = 1001;
                      return (
                        <div key={idx} className="grid grid-cols-[8rem_1fr_6rem] items-center gap-3 text-sm">
                          <span style={{ color: '#aeb9cc' }}>{d.country}</span>
                          <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(26, 95, 122, 0.3)' }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ background: 'linear-gradient(to right, #1a5f7a, var(--highlight))', width: `${(d.amount / max) * 100}%` }}
                            />
                          </div>
                          <span className="text-right font-medium tabular-nums" style={{ color: '#aeb9cc' }}>{d.amount.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="my-8">
                  <h3 className="text-2xl font-normal text-white mb-3">Non-IFI funders</h3>
                  <p className="text-gray-300 leading-relaxed mb-6 max-w-3xl">
                    The largest external funders include KfW Bankengruppe, AFD, China Everbright Limited, and the ASEAN Infrastructure Fund. GEF appears across multiple projects and multiple banks.
                  </p>
                  <div className="rounded-lg p-6 border" style={{ borderColor: '#2f4059', backgroundColor: '#0d1b2a' }}>
                    <div className="space-y-3">
                      {[
                        { name: "KfW Bankengruppe", amount: 843.48, bank: "ADB" },
                        { name: "China Everbright Limited", amount: 771.31, bank: "WBG / AIIB" },
                        { name: "AFD", amount: 497.89, bank: "ADB" },
                        { name: "ASEAN Infrastructure Fund", amount: 200, bank: "ADB" },
                        { name: "LEAP (admin. by ADB)", amount: 123.1, bank: "ADB" },
                        { name: "Dynagreen", amount: 44.48, bank: "WBG" },
                        { name: "Global Environment Facility (GEF)", amount: 16, bank: "ADB / WBG" },
                        { name: "JFJCM", amount: 10, bank: "ADB" },
                        { name: "Korea Development Bank", amount: 8, bank: "WBG" },
                        { name: "Republic of Korea E-Asia Fund", amount: 6.5, bank: "ADB" },
                        { name: "Govt. of Norway", amount: 5.28, bank: "ADB" },
                        { name: "High Level Technology Fund", amount: 2, bank: "ADB" },
                        { name: "Japan Fund for Poverty Reduction", amount: 1.5, bank: "ADB" },
                        { name: "ETMPF", amount: 2, bank: "ADB" },
                        { name: "Govt. of Australia", amount: 1, bank: "ADB" },
                      ].map((f, idx) => {
                        const maxAmount = 843.48;
                        return (
                          <div key={idx}>
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center gap-2 min-w-0">
                                <span style={{ color: 'white' }} className="font-normal">{f.name}</span>
                                <span className="text-xs" style={{ color: '#aeb9cc' }}>{f.bank}</span>
                              </div>
                              <span className="text-right font-medium tabular-nums ml-2" style={{ color: '#aeb9cc' }}>${f.amount.toLocaleString()} M</span>
                            </div>
                            <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(26, 95, 122, 0.3)' }}>
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ background: 'linear-gradient(to right, #1a5f7a, var(--highlight))', width: `${(f.amount / maxAmount) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="my-8">
                  <h3 className="text-2xl font-normal text-white mb-3">A note on rating inconsistencies</h3>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      ADB assigns letter grades A–C across three parameters (environment, involuntary resettlement, indigenous peoples), where A denotes high risk. Technical Assistance projects receive no rating at all, since they typically lack infrastructure components. Even within rated projects, inconsistencies are common — similar WtE projects display a wide range of environmental grades despite comparable scale.
                    </p>
                    <p>
                      AIIB consolidates risk into a single cumulative grade. JICA offers minimal disclosure, occasionally assigning combined ratings only when full feasibility studies exist. In cases lacking official ratings, the database makes informed assumptions based on institutional patterns — not GAIA's independent assessment.
                    </p>
                    <p>
                      Many projects have 15 to 50 individual project documents. While the team validated information with multiple rounds of review, full document-by-document parsing was infeasible within the project timeframe — a known limitation surfaced here in the interest of transparency.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-16 px-4 sm:px-8 text-white border-t" style={{ borderColor: 'rgba(255, 165, 0, 0.1)', backgroundColor: '#00071b' }}>
        <div className="container mx-auto">
          <SectionLabel>
            <span className="text-white">Methodology</span>
          </SectionLabel>
          <h2 className="text-4xl font-normal mb-10 max-w-3xl">Methodology and data sources.</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-lg p-6 border" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
              <div className="font-normal text-2xl mb-3" style={{ color: 'var(--highlight)' }}>01</div>
              <div className="text-base font-medium mb-3 text-white">Where the data comes from</div>
              <p className="text-sm text-gray-300 leading-relaxed">
                The Atlas is not based on a single source of information. Project data is collated
                from existing GAIA repositories (including all its campaigns, member meetings, and
                participation in climate events from around the world), and publicly available
                information from IFIs, governments, and companies, usually published on project
                microsites. We use OpenStreetMap to show project locations.
              </p>
            </div>
            <div className="rounded-lg p-6 border" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
              <div className="font-normal text-2xl mb-3" style={{ color: 'var(--highlight)' }}>02</div>
              <div className="text-base font-medium mb-3 text-white">How it is compiled</div>
              <p className="text-sm text-gray-300 leading-relaxed">
                The Atlas brings together project descriptions, risk assessments, financiers, and
                key environmental and social issues raised around each project. Because official
                documentation does not always capture local experiences and impacts fully, the
                Atlas also draws on community and civil-society knowledge, including news,
                campaigns, social media, and grey literature in local languages.
              </p>
            </div>
            <div className="rounded-lg p-6 border" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
              <div className="font-normal text-2xl mb-3" style={{ color: 'var(--highlight)' }}>03</div>
              <div className="text-base font-medium mb-3 text-white">What comes next</div>
              <p className="text-sm text-gray-300 leading-relaxed">
                To complement our main database, we also publish factsheets that examine IFI-wise
                investments and cross-cutting just-transition concerns, including the inclusion of
                waste workers across projects. In the future, we hope to put out more research at
                the intersection of bank policy and national policy, translations of key
                materials, and trends on false solutions vs. circular economy investments across
                countries in Asia-Pacific.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations Section */}
      <section className="py-16 px-4 sm:px-8 text-white border-t" style={{ borderColor: 'rgba(255, 165, 0, 0.1)', backgroundColor: '#00112b' }}>
        <div className="container mx-auto">
          <SectionLabel>Transparency</SectionLabel>
          <h2 className="text-4xl font-normal mb-4 max-w-3xl">What are the limitations of this project?</h2>
          <p className="text-gray-400 max-w-2xl mb-12">
            We publish these limitations in the interest of transparency, so every entry can be
            read with its context in mind.
          </p>
          <div className="space-y-4 max-w-4xl">
            {limitations.map((l) => (
              <div key={l.n} className="rounded-lg p-6 border" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-normal text-2xl" style={{ color: 'var(--highlight)' }}>
                    {l.n}
                  </span>
                  <h3 className="text-xl font-normal text-white">{l.title}</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-300 leading-relaxed md:pl-12">
                  {l.body.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
