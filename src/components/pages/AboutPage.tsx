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
  return (
    <div style={{ backgroundColor: 'var(--deep)' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white py-20 md:py-28">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at 20% 10%, rgba(100, 200, 255, 0.2), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(255, 165, 0, 0.1), transparent 55%)',
          }}
        />
        <div className="container mx-auto relative px-4 sm:px-8">
          <SectionLabel>About the Atlas</SectionLabel>
          <h1 className="text-5xl md:text-7xl leading-[1.02] max-w-4xl font-bold mb-8">
            Tracking false solutions. Making development finance{' '}
            <span style={{ color: 'var(--highlight)' }}>visible.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed mb-6">
            The climate crisis demands urgent action—but urgency cannot come at the expense of accountability. Investments made today can lock communities and countries into development pathways for decades. As governments and International Financial Institutions (IFIs) promote climate action, circular economy and a just transition, we must ask: is their money accelerating the transition—or deepening the crisis?
          </p>
          <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">
            Public and IFI finance can support infrastructure that perpetuates extraction, consumption and disposal, including incineration, waste-to-energy (WTE), chemical and advanced recycling, carbon capture and other false solutions. For peoples' movements, the questions are: Who finances it? Who profits? Who bears the costs? What gets locked in? And whose solutions are displaced? Financing capital intensive waste technologies in the Global South while neglecting prevention, reuse, repair, recycling, composting and waste-worker livelihoods risks reinforcing waste colonialism and inequality.
          </p>
        </div>
      </section>

      {/* False Solutions Section */}
      <section className="py-16 px-4 sm:px-8 text-white border-t" style={{ borderColor: 'rgba(255, 165, 0, 0.1)' }}>
        <div className="container mx-auto">
          <SectionLabel>
            <span className="text-white">What we mean by</span>
          </SectionLabel>
          <h2 className="text-5xl font-bold mb-12 max-w-3xl">False solutions.</h2>
          
          <div className="mb-12 max-w-4xl">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              A false solution presents itself as addressing the waste and plastic crisis but in practice fails to tackle — and often exacerbates — its root causes: overproduction, overconsumption, and the absence of systemic commitments. They preserve the status quo while creating new environmental and social harms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {falseSolutions.map((solution, idx) => (
              <div
                key={idx}
                className="rounded-lg p-6 border-2 h-full"
                style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}
              >
                <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--highlight)' }}>
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
      <section className="py-16 px-4 sm:px-8 text-white border-t" style={{ borderColor: 'rgba(255, 165, 0, 0.1)' }}>
        <div className="container mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <SectionLabel>Who we track</SectionLabel>
              <h2 className="text-4xl font-bold max-w-2xl">What does the Atlas track?</h2>
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
                  className="rounded p-6 h-full cursor-pointer transition-all duration-300 border-2 hover:border-opacity-100"
                  style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}
                >
                  <div className="font-bold text-4xl mb-4" style={{ color: 'var(--highlight)' }}>
                    {i.code}
                  </div>
                  <div className="text-white font-medium leading-snug text-sm mb-3">{i.name}</div>
                  {i.desc && <div className="text-xs text-gray-400 mb-4">{i.desc}</div>}
                  <div style={{ color: '#64b5ff' }} className="text-sm font-medium">
                    READ PROFILE →
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-gray-300 leading-relaxed max-w-3xl">
            These bodies often work with national and municipal governments, state-owned entities,
            and corporations. Their involvement can take many forms, including loans, equity,
            grants, technical assistance, guarantees, and other financial instruments.
          </p>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-16 px-4 sm:px-8 text-white border-t" style={{ borderColor: 'rgba(255, 165, 0, 0.1)' }}>
        <div className="container mx-auto">
          <SectionLabel>
            <span className="text-white">Methodology</span>
          </SectionLabel>
          <h2 className="text-4xl font-bold mb-10 max-w-3xl">Methodology and data sources.</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded p-6 border-2" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
              <div className="font-bold text-2xl mb-3" style={{ color: 'var(--highlight)' }}>01</div>
              <div className="text-base font-medium mb-3 text-white">Where the data comes from</div>
              <p className="text-sm text-gray-300 leading-relaxed">
                The Atlas is not based on a single source of information. Project data is collated
                from existing GAIA repositories (including all its campaigns, member meetings, and
                participation in climate events from around the world), and publicly available
                information from IFIs, governments, and companies, usually published on project
                microsites. We use OpenStreetMap to show project locations.
              </p>
            </div>
            <div className="rounded p-6 border-2" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
              <div className="font-bold text-2xl mb-3" style={{ color: 'var(--highlight)' }}>02</div>
              <div className="text-base font-medium mb-3 text-white">How it is compiled</div>
              <p className="text-sm text-gray-300 leading-relaxed">
                The Atlas brings together project descriptions, risk assessments, financiers, and
                key environmental and social issues raised around each project. Because official
                documentation does not always capture local experiences and impacts fully, the
                Atlas also draws on community and civil-society knowledge, including news,
                campaigns, social media, and grey literature in local languages.
              </p>
            </div>
            <div className="rounded p-6 border-2" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
              <div className="font-bold text-2xl mb-3" style={{ color: 'var(--highlight)' }}>03</div>
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
      <section className="py-16 px-4 sm:px-8 text-white border-t" style={{ borderColor: 'rgba(255, 165, 0, 0.1)' }}>
        <div className="container mx-auto">
          <SectionLabel>Transparency</SectionLabel>
          <h2 className="text-4xl font-bold mb-4 max-w-3xl">What are the limitations of this project?</h2>
          <p className="text-gray-400 max-w-2xl mb-12">
            We publish these limitations in the interest of transparency, so every entry can be
            read with its context in mind.
          </p>
          <div className="space-y-4 max-w-4xl">
            {limitations.map((l) => (
              <div key={l.n} className="rounded p-6 border-2" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-bold text-2xl" style={{ color: 'var(--highlight)' }}>
                    {l.n}
                  </span>
                  <h3 className="text-xl font-bold text-white">{l.title}</h3>
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

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-8 text-white border-t" style={{ borderColor: 'rgba(255, 165, 0, 0.1)' }}>
        <div className="container mx-auto rounded-2xl p-10 md:p-16 relative overflow-hidden" style={{ backgroundColor: 'rgba(26, 95, 122, 0.15)' }}>
          <SectionLabel>
            <span className="text-white">Get involved</span>
          </SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold max-w-3xl mb-6">Help us keep the Atlas honest.</h2>
          <p className="text-gray-300 max-w-2xl mb-8 leading-relaxed">
            Communities, waste-worker collectives, journalists and researchers — share on-ground
            information about waste-to-energy projects, livelihood impacts, or gaps in official
            reporting. Every submission is vetted by the Atlas team and GAIA partners before being
            included.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/partner-with-us" className="px-6 py-3 rounded font-medium transition-all hover:opacity-90 text-gray-900" style={{ backgroundColor: 'var(--highlight)' }}>
              Report a project →
            </Link>
            <Link href="/" className="px-6 py-3 rounded font-medium border-2 transition-colors hover:opacity-80" style={{ borderColor: '#2f4059' }}>
              Back to overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
