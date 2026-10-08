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
    <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3 flex items-center gap-3">
      <span className="h-px w-10" style={{ backgroundColor: 'var(--highlight)' }} />
      {children}
    </div>
  )
}

const AboutPage: React.FC = () => {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse at 20% 10%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 60%), radial-gradient(ellipse at 80% 90%, color-mix(in oklab, var(--highlight) 18%, transparent), transparent 55%)',
          }}
        />
        <div className="container mx-auto relative py-20 px-4 sm:px-8 md:py-28">
          <SectionLabel>About the Atlas</SectionLabel>
          <h1 className="text-5xl md:text-7xl leading-[1.02] max-w-4xl font-bold text-foreground mb-8">
            Tracking false solutions. Making development finance{' '}
            <span style={{ color: 'var(--highlight)' }}>visible.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-6">
            The Citizens' Atlas on False Solutions on Waste is a crowd-sourced, open-access website
            documenting how waste "solutions" are rationalised and financed across the Asia-Pacific
            region. It brings together information on projects, technologies, development banks,
            governments, private actors, and environmental and social impacts to make climate and
            development finance more visible and easier to scrutinise.
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            By bringing together information scattered across project documents, social media, and
            grey literature, the Atlas asks:{' '}
            <span style={{ color: 'var(--highlight)' }}>
              who is financing which waste technologies, where, and with what consequences?
            </span>
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8 border-t border-border" style={{ backgroundColor: 'var(--deep)' }}>
        <div className="container mx-auto">
          <SectionLabel>
            <span className="text-foreground">False solutions</span>
          </SectionLabel>
          <h2 className="text-4xl font-bold text-foreground mb-6 max-w-3xl">What are false solutions?</h2>
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-5 text-muted-foreground leading-relaxed">
              <p>
                False solutions describe approaches to the waste crisis that do not address their
                underlying causes: overproduction, overconsumption, and the linear
                take-make-dispose model. In some cases, they can create or intensify new
                environmental and social harms while allowing governments and corporations to claim
                progress without a plan for long-term change to the climate status quo.
              </p>
              <p>
                They can divert public and private resources from waste prevention and effective,
                local-first, and cheaper circular systems in favour of waste colonialism that
                encourage knowledge and finance transfer abroad. They may also depend on narratives
                such as green growth, carbon neutrality, or plastic neutrality while leaving the
                volume of waste to be dealt with, largely unchanged. They are also detrimental to
                environmental justice in the project area.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="text-sm text-foreground font-medium mb-4">
                The Atlas currently tracks several such technologies including:
              </div>
              <div className="space-y-3">
                {trackedTechnologies.map((t) => (
                  <div
                    key={t}
                    className="rounded-lg p-4 border border-border text-sm leading-relaxed text-muted-foreground"
                    style={{ backgroundColor: 'var(--surface)' }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8">
        <div className="container mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <SectionLabel>Who we track</SectionLabel>
              <h2 className="text-4xl font-bold max-w-2xl text-foreground">What does the Atlas track?</h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              The Atlas currently tracks projects supported by four major financial institutions.
              The database will expand in future to include projects supported by GIZ and KOICA.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {trackedInstitutions.map((i) => (
              <Link href={`/${i.code.toLowerCase()}`} key={i.code}>
                <div
                  className="rounded-lg p-6 border border-border h-full cursor-pointer transition-all duration-300 hover:border-brand-medium-blue"
                  style={{ backgroundColor: 'var(--surface)' }}
                >
                  <div className="font-bold text-4xl mb-4" style={{ color: 'var(--highlight)' }}>
                    {i.code}
                  </div>
                  <div className="text-foreground font-medium leading-snug text-sm mb-3">{i.name}</div>
                  {i.desc && <div className="text-xs text-muted-foreground mb-4">{i.desc}</div>}
                  <div style={{ color: 'var(--highlight)' }} className="text-sm font-medium">READ PROFILE →</div>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            These bodies often work with national and municipal governments, state-owned entities,
            and corporations. Their involvement can take many forms, including loans, equity,
            grants, technical assistance, guarantees, and other financial instruments.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8 border-t border-border" style={{ backgroundColor: 'var(--deep)' }}>
        <div className="container mx-auto">
          <SectionLabel>
            <span className="text-foreground">Methodology</span>
          </SectionLabel>
          <h2 className="text-4xl font-bold text-foreground mb-10 max-w-3xl">Methodology and data sources.</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-lg p-6 border border-border" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="font-bold text-2xl mb-3" style={{ color: 'var(--highlight)' }}>01</div>
              <div className="text-base font-medium mb-3 text-foreground">Where the data comes from</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Atlas is not based on a single source of information. Project data is collated
                from existing GAIA repositories (including all its campaigns, member meetings, and
                participation in climate events from around the world), and publicly available
                information from IFIs, governments, and companies, usually published on project
                microsites. We use OpenStreetMap to show project locations.
              </p>
            </div>
            <div className="rounded-lg p-6 border border-border" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="font-bold text-2xl mb-3" style={{ color: 'var(--highlight)' }}>02</div>
              <div className="text-base font-medium mb-3 text-foreground">How it is compiled</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Atlas brings together project descriptions, risk assessments, financiers, and
                key environmental and social issues raised around each project. Because official
                documentation does not always capture local experiences and impacts fully, the
                Atlas also draws on community and civil-society knowledge, including news,
                campaigns, social media, and grey literature in local languages.
              </p>
            </div>
            <div className="rounded-lg p-6 border border-border" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="font-bold text-2xl mb-3" style={{ color: 'var(--highlight)' }}>03</div>
              <div className="text-base font-medium mb-3 text-foreground">What comes next</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
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

      <section className="py-16 px-4 sm:px-8">
        <div className="container mx-auto">
          <SectionLabel>Transparency</SectionLabel>
          <h2 className="text-4xl font-bold text-foreground mb-4 max-w-3xl">What are the limitations of this project?</h2>
          <p className="text-muted-foreground max-w-2xl mb-12">
            We publish these limitations in the interest of transparency, so every entry can be
            read with its context in mind.
          </p>
          <div className="space-y-4 max-w-4xl">
            {limitations.map((l) => (
              <div key={l.n} className="rounded-lg p-6 border border-border" style={{ backgroundColor: 'var(--surface)' }}>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-bold text-2xl" style={{ color: 'var(--highlight)' }}>
                    {l.n}
                  </span>
                  <h3 className="text-xl font-bold text-foreground">{l.title}</h3>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed md:pl-12">
                  {l.body.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8">
        <div className="container mx-auto rounded-2xl p-10 md:p-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--surface), var(--deep))' }}>
          <SectionLabel>Get involved</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold max-w-3xl mb-6 text-foreground">Help us keep the Atlas honest.</h2>
          <p className="text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Communities, waste-worker collectives, journalists and researchers — share on-ground
            information about waste-to-energy projects, livelihood impacts, or gaps in official
            reporting. Every submission is vetted by the Atlas team and GAIA partners before being
            included.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/partner-with-us" className="px-6 py-3 rounded-md font-medium transition-all hover:opacity-90" style={{ backgroundColor: 'var(--highlight)', color: 'var(--deep)' }}>
              Report a project →
            </Link>
            <Link href="/" className="px-6 py-3 rounded-md font-medium border border-border hover:opacity-80 transition-colors text-foreground">
              Back to overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
