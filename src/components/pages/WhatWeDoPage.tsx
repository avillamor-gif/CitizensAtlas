'use client'

import React from 'react';

const FeatureCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-light-blue text-white mb-6">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-brand-dark-blue mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{children}</p>
    </div>
);

const WhatWeDoPage: React.FC = () => {
    return (
        <div className="bg-gray-50">
            <div className="bg-brand-dark-blue text-white px-4 sm:px-8 text-center min-h-[300px] flex flex-col justify-center items-center">
                <div>
                    <h1 className="text-5xl font-extrabold mb-4">What We Do</h1>
                    <p className="text-xl max-w-3xl mx-auto">
                        We provide data, tools, and stories to help communities fight for environmental justice and promote real Zero Waste solutions.
                    </p>
                </div>
            </div>
            <div className="py-16 px-4 sm:px-8">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            title="Map False Solutions"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        >
                            Our core work is building a global, crowdsourced database of projects that undermine climate and circular economy goals. From incinerators to plastic-to-fuel plants, we track their location, funding, and environmental impact.
                        </FeatureCard>
                        <FeatureCard
                            title="Investigate Corruption & Greenwashing"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                        >
                            We expose the financial and political mechanisms that prop up these harmful industries. We follow the money from international financial institutions to local projects, highlighting conflicts of interest and lack of transparency.
                        </FeatureCard>
                        <FeatureCard
                            title="Empower Communities with Data"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                        >
                            Knowledge is power. By making complex data accessible and understandable, we provide communities with the evidence they need to challenge misleading corporate claims and hold decision-makers accountable.
                        </FeatureCard>
                        <FeatureCard
                            title="Amplify Local Stories"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        >
                            We platform the voices of those on the frontlines of environmental injustice. Through case studies, articles, and videos, we share powerful stories of resistance, resilience, and the fight for a healthier planet.
                        </FeatureCard>
                        <FeatureCard
                            title="Promote Real Solutions"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        >
                            Our work isn't just about stopping the bad; it's about championing the good. We highlight and promote proven, community-led Zero Waste systems that build local economies, create green jobs, and protect the environment.
                        </FeatureCard>
                        <FeatureCard
                            title="Foster Global Collaboration"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.5l-1.414 1.414M16.293 4.5l1.414 1.414M12 18.5a5 5 0 01-10 0" /></svg>}
                        >
                            The challenges we face are global, and so are the solutions. We connect grassroots groups, researchers, legal experts, and advocates from around the world to share strategies, build solidarity, and create a unified movement.
                        </FeatureCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatWeDoPage;