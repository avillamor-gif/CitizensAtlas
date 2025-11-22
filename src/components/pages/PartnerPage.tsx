'use client'

import React from 'react';
import { ArrowRightIcon } from '@/components/ui/icons';

const PartnerPage: React.FC = () => {
    return (
        <div className="bg-white">
            <div className="bg-brand-dark-blue text-white px-4 sm:px-8 text-center min-h-[300px] flex flex-col justify-center items-center">
                <div>
                    <h1 className="text-5xl font-extrabold mb-4">Partner With Us</h1>
                    <p className="text-xl max-w-3xl mx-auto">
                        Help us build the most comprehensive global database on false solutions and community-led resistance.
                    </p>
                </div>
            </div>
            <div className="py-16 px-4 sm:px-8">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-brand-dark-blue mb-2">Why Collaborate?</h2>
                        <div className="w-16 h-1 bg-brand-dark-blue mx-auto mb-4"></div>
                        <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                            The fight for environmental justice is a collective effort. By sharing knowledge, resources, and strategies, we can amplify our impact and accelerate the transition to a Zero Waste future. Your expertise and on-the-ground knowledge are invaluable to this mission.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 items-start">
                        <div className="bg-gray-50 p-8 rounded-lg border h-full">
                            <img src="https://picsum.photos/seed/submit-project/800/400" alt="Person adding data to a map on a laptop" className="rounded-lg shadow-md mb-6 w-full h-64 object-cover" />
                            <h3 className="text-2xl font-bold text-brand-dark-blue mb-4">Submit a Project</h3>
                            <p className="text-gray-600 mb-4">
                                Are you aware of a polluting incinerator, a risky chemical recycling plant, or a greenwashed project in your community? Help us put it on the map. We are looking for data on:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Project locations and technical details</li>
                                <li>Corporate and financial backers</li>
                                <li>Community opposition and resistance efforts</li>
                                <li>Environmental and social impact assessments</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-lg border h-full">
                            <img src="https://picsum.photos/seed/share-story/800/400" alt="People at a community protest holding signs" className="rounded-lg shadow-md mb-6 w-full h-64 object-cover" />
                            <h3 className="text-2xl font-bold text-brand-dark-blue mb-4">Share Your Story</h3>
                            <p className="text-gray-600 mb-4">
                                Personal stories are powerful tools for change. We want to feature the voices of community leaders, activists, and waste workers who are fighting false solutions. Share your experience with:
                            </p>
                             <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Organizing your community</li>
                                <li>Advocating with policymakers</li>
                                <li>The impacts of pollution on your health and livelihood</li>
                                <li>Successful campaigns for Zero Waste</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 text-center bg-brand-section-blue text-white p-12 rounded-lg">
                        <h2 className="text-4xl font-extrabold mb-4">Let's Connect</h2>
                        <p className="text-lg mb-8 max-w-2xl mx-auto">
                            Whether you are a grassroots organization, a researcher, a journalist, or a concerned citizen, we want to hear from you. Reach out to share information, ask questions, or explore partnership opportunities.
                        </p>
                        <a href="mailto:citizensatlas@no-burn.org" className="inline-flex items-center text-lg font-bold bg-brand-yellow text-brand-dark-blue py-4 px-8 rounded-md hover:bg-yellow-300 transition-colors">
                            <span className="w-8 h-8 rounded-full bg-brand-dark-blue flex items-center justify-center mr-3">
                                <ArrowRightIcon className="w-5 h-5 text-white" />
                            </span>
                            citizensatlas@no-burn.org
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerPage;