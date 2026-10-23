'use client';

import React from 'react';
import { PartnerReport } from '@/types/types';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/icons';

interface PartnerReportCarouselProps {
    reports: PartnerReport[];
}

const PartnerReportCarousel: React.FC<PartnerReportCarouselProps> = ({ reports }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [selectedReport, setSelectedReport] = React.useState<PartnerReport | null>(null);
    const [photoSliderIndex, setPhotoSliderIndex] = React.useState(0);
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

    React.useEffect(() => {
        // Reset photo slider when selecting a new report
        setPhotoSliderIndex(0);
    }, [selectedReport]);

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
                        <div 
                            onClick={() => setSelectedReport(report)}
                            className="rounded-lg border bg-gray-900 p-4 h-full transition-all duration-300 group cursor-pointer"
                            style={{ borderColor: 'rgb(55, 65, 81)' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--highlight)';
                                const titleEl = e.currentTarget.querySelector('h4');
                                if (titleEl) titleEl.style.color = 'var(--highlight)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgb(55, 65, 81)';
                                const titleEl = e.currentTarget.querySelector('h4');
                                if (titleEl) titleEl.style.color = 'white';
                            }}
                        >
                            <div className="mb-3">
                                <span
                                    style={{ backgroundColor: 'var(--highlight)', color: '#0a1628' }}
                                    className="text-xs font-bold px-2 py-1 inline-block mb-2"
                                >
                                    {report.region}
                                </span>
                            </div>

                            <h4 className="text-white mb-2 transition-colors line-clamp-2">
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
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 text-white rounded-full p-2 transition-all duration-300 z-10"
                        aria-label="Scroll left"
                        style={{ backgroundColor: 'var(--highlight)', color: '#0a1628' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 text-white rounded-full p-2 transition-all duration-300 z-10"
                        aria-label="Scroll right"
                        style={{ backgroundColor: 'var(--highlight)', color: '#0a1628' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                </>
            )}

            {selectedReport && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={() => setSelectedReport(null)}
                >
                    <div 
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: '#0a1628', color: '#c5ced9' }}
                    >
                        <div className="sticky top-0 z-20 flex items-center justify-between border-b px-6 py-4" style={{ backgroundColor: '#0f2340', borderColor: '#2f4059' }}>
                            <h2 className="" style={{ color: '#ffffff' }}>Report Details</h2>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="transition"
                                style={{ color: '#6b7a8f' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#9aacbf'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7a8f'}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6 px-6 py-6">
                            {selectedReport.photos && selectedReport.photos.length > 0 && (
                                <div>
                                    <label className="text-sm font-semibold block mb-3" style={{ color: '#ffffff' }}>
                                        📸 Photos ({selectedReport.photos.length})
                                    </label>
                                    <div className="relative rounded-lg overflow-hidden" style={{ backgroundColor: '#0d1b2a' }}>
                                        <div className="aspect-video flex items-center justify-center" style={{ backgroundColor: '#111f2e' }}>
                                            {selectedReport.photos[photoSliderIndex] ? (
                                                <img 
                                                    src={selectedReport.photos[photoSliderIndex]} 
                                                    alt={`Photo ${photoSliderIndex + 1}`}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <p className="text-sm" style={{ color: '#6b7a8f' }}>Photo unavailable</p>
                                                </div>
                                            )}
                                        </div>

                                        {selectedReport.photos.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => setPhotoSliderIndex((prev) => (prev === 0 ? selectedReport.photos!.length - 1 : prev - 1))}
                                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white rounded-full p-2 transition z-10"
                                                    title="Previous photo"
                                                    style={{ backgroundColor: 'rgba(255, 165, 0, 0.7)' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--highlight)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 165, 0, 0.7)'}
                                                >
                                                    <ArrowLeftIcon className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => setPhotoSliderIndex((prev) => (prev === selectedReport.photos!.length - 1 ? 0 : prev + 1))}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white rounded-full p-2 transition z-10"
                                                    title="Next photo"
                                                    style={{ backgroundColor: 'rgba(255, 165, 0, 0.7)' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--highlight)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 165, 0, 0.7)'}
                                                >
                                                    <ArrowRightIcon className="w-4 h-4" />
                                                </button>

                                                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-white text-xs px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                                                    {photoSliderIndex + 1} / {selectedReport.photos.length}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold" style={{ color: '#ffffff' }}>Date</label>
                                    <p className="mt-1" style={{ color: '#a0b0c8' }}>{selectedReport.date}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold" style={{ color: '#ffffff' }}>Region</label>
                                    <p className="mt-1" style={{ color: '#a0b0c8' }}>{selectedReport.region}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold" style={{ color: '#ffffff' }}>Consulted</label>
                                <p className="mt-1" style={{ color: '#a0b0c8' }}>{selectedReport.consulted}</p>
                            </div>

                            <div>
                                <label className="text-sm font-semibold" style={{ color: '#ffffff' }}>Operating Company</label>
                                <p className="mt-1" style={{ color: '#a0b0c8' }}>{selectedReport.operatingCompany || 'N/A'}</p>
                            </div>

                            <div>
                                <label className="text-sm font-semibold" style={{ color: '#ffffff' }}>Issue Description</label>
                                <p className="mt-1 whitespace-pre-wrap" style={{ color: '#a0b0c8' }}>{selectedReport.issue}</p>
                            </div>

                            <div>
                                <label className="text-sm font-semibold" style={{ color: '#ffffff' }}>Observations & Impact</label>
                                <p className="mt-1 whitespace-pre-wrap" style={{ color: '#a0b0c8' }}>{selectedReport.observations}</p>
                            </div>

                            {selectedReport.relevantLinks && selectedReport.relevantLinks.length > 0 && (
                                <div>
                                    <label className="text-sm font-semibold" style={{ color: '#ffffff' }}>Relevant Links</label>
                                    <ul className="mt-1 space-y-1">
                                        {selectedReport.relevantLinks.map((link, idx) => (
                                            <li key={idx}>
                                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: 'var(--highlight)' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                                                    {link}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartnerReportCarousel;
