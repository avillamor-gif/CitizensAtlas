'use client';

import React from 'react';
import { PartnerReport } from '@/types/types';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/icons';

interface PartnerReportCarouselProps {
    reports: PartnerReport[];
}

const PartnerReportCarousel: React.FC<PartnerReportCarouselProps> = ({ reports }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const carouselRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = 300;
            if (direction === 'left') {
                carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (reports.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full">
            <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
                style={{ scrollBehavior: 'smooth' }}
            >
                {reports.map((report, idx) => (
                    <div key={report.id || idx} className="flex-shrink-0 w-72">
                        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 h-full hover:border-orange-500 transition-all duration-300 group">
                            <div className="mb-3">
                                <span
                                    style={{ backgroundColor: 'var(--highlight)', color: '#0a1628' }}
                                    className="text-xs font-bold px-2 py-1 inline-block mb-2"
                                >
                                    {report.region}
                                </span>
                            </div>

                            <h4 className="text-white font-bold mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                                {report.issue}
                            </h4>

                            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                {report.observations}
                            </p>

                            <div className="text-xs text-gray-400 space-y-1">
                                <p>
                                    <span className="font-semibold">Submitted by:</span> {report.name}
                                </p>
                                <p>
                                    <span className="font-semibold">Date:</span>{' '}
                                    {new Date(report.submittedAt).toLocaleDateString()}
                                </p>
                                {report.operatingCompany && (
                                    <p>
                                        <span className="font-semibold">Company:</span> {report.operatingCompany}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {reports.length > 2 && (
                <>
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 transition-all duration-300 z-10"
                        aria-label="Scroll left"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 transition-all duration-300 z-10"
                        aria-label="Scroll right"
                    >
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                </>
            )}
        </div>
    );
};

export default PartnerReportCarousel;
