'use client'

import React from 'react';

const PageSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h2 className="text-3xl font-extrabold text-brand-dark-blue mb-2">{title}</h2>
        <div className="w-16 h-1 bg-brand-dark-blue mb-4"></div>
        <div className="text-gray-700 text-lg leading-relaxed space-y-4">
            {children}
        </div>
    </div>
);

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white">
            <div className="bg-brand-dark-blue text-white px-4 sm:px-8 text-center min-h-[300px] flex flex-col justify-center items-center">
                <div>
                    <h1 className="text-5xl font-extrabold mb-4">About the Citizens' Atlas</h1>
                    <p className="text-xl max-w-3xl mx-auto">
                        Exposing false solutions and empowering communities for a Zero Waste future.
                    </p>
                </div>
            </div>
            <div className="py-16 px-4 sm:px-8">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <PageSection title="Our Mission">
                                <p>
                                    The Citizens' Atlas is a collaborative, data-driven platform dedicated to mapping and exposing false solutions to the climate and waste crises. Our mission is to empower communities, activists, and policymakers with the tools, data, and stories needed to challenge harmful projects and advocate for genuine, just, and sustainable Zero Waste solutions.
                                </p>
                            </PageSection>
                        </div>
                        <div>
                            <img src="https://picsum.photos/seed/mission/800/600" alt="A diverse group of people collaborating around a table." className="rounded-lg shadow-lg" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="md:order-2">
                            <PageSection title="Our Vision">
                                <p>
                                    We envision a world free from the toxic burden of waste incineration, chemical recycling, and other greenwashed technologies. We believe in a future where resources are valued, consumption is mindful, and communities—especially those most impacted by pollution and environmental injustice—are at the forefront of building circular, resilient, and equitable local economies.
                                </p>
                            </PageSection>
                        </div>
                        <div className="md:order-1">
                            <img src="https://picsum.photos/seed/vision/800/600" alt="A pristine natural landscape with clean air and vibrant green fields." className="rounded-lg shadow-lg" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-brand-dark-blue py-16 px-4 sm:px-8">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-extrabold text-white mb-2">The Problem We Address</h2>
                    <div className="w-16 h-1 bg-white mx-auto mb-4"></div>
                    <div className="text-lg leading-relaxed space-y-4 text-gray-200">
                        <p>
                            For decades, corporations and governments have promoted capital-intensive, high-tech "solutions" to waste management and climate change that fail to address the root causes of these problems. Projects like waste-to-energy incinerators, plastic-to-fuel schemes, and flawed carbon offsetting projects often receive massive public subsidies and private investment, yet they perpetuate pollution, harm public health, and distract from real solutions.
                        </p>
                        <p>
                            These false solutions are frequently cloaked in the language of sustainability and progress, making it difficult for communities to recognize the threats they pose. Corruption, lack of transparency, and the exclusion of public participation in decision-making processes further entrench these harmful industries.
                        </p>
                    </div>
                </div>
            </div>

            <div className="py-16 px-4 sm:px-8">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <PageSection title="Our Approach">
                                <p>
                                    The Citizens' Atlas fights back with transparency. By crowdsourcing and verifying data on these projects, we create a living map that reveals the true scale and impact of false solutions around the globe. We track financial flows, identify the corporations and institutions involved, and document community resistance.
                                </p>
                                <p>
                                    This platform is more than just a map—it's a resource hub, a storytelling platform, and a network for global solidarity. We provide case studies, research materials, and advocacy tools to support local campaigns and inform international policy debates.
                                </p>
                            </PageSection>
                        </div>
                        <div>
                            <img src="https://picsum.photos/seed/approach/800/600" alt="A person interacting with a large digital map showing data points." className="rounded-lg shadow-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;