
import React from 'react';
import Image from 'next/image';
import { ArrowRightIcon } from '@/components/ui/icons';

const Collaborate: React.FC = () => {
    return (
        <section className="bg-brand-dark-blue py-16 px-4 sm:px-8">
            <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
                <div className="text-white">
                    <h2 className="atlas-display-heading mb-2">COLLABORATE WITH US</h2>
                    <div className="w-16 h-1 bg-white mb-4"></div>
                </div>
                <div className="text-white">
                    <p className="text-lg mb-6">
                        We are actively updating our database on false solutions to climate and circularity. Can you help us?
                    </p>
                    <a href="mailto:citizensatlas@no-burn.org" className="flex items-center text-lg font-bold text-brand-yellow hover:text-yellow-300 transition-colors">
                        <span className="w-8 h-8 rounded-full bg-brand-yellow flex items-center justify-center mr-3">
                            <ArrowRightIcon className="w-5 h-5 text-brand-dark-blue" />
                        </span>
                        citizensatlas@no-burn.org
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Collaborate;
