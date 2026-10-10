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
                            className="rounded-lg border border-gray-700 bg-gray-900 p-4 h-full hover:border-orange-500 transition-all duration-300 group cursor-pointer"
                        >
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

            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-lg">
                        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                            <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="text-gray-500 hover:text-gray-700 transition"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6 px-6 py-6">
                            {selectedReport.photos && selectedReport.photos.length > 0 && (
                                <div>
                                    <label className="text-sm font-semibold text-gray-900 block mb-3">
                                        📸 Photos ({selectedReport.photos.length})
                                    </label>
                                    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                                        <div className="aspect-video bg-gray-800 flex items-center justify-center">
                                            {selectedReport.photos[photoSliderIndex] ? (
                                                <img 
                                                    src={selectedReport.photos[photoSliderIndex]} 
                                                    alt={`Photo ${photoSliderIndex + 1}`}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="text-gray-400 text-center">
                                                    <p className="text-sm">Photo unavailable</p>
                                                </div>
                                            )}
                                        </div>

                                        {selectedReport.photos.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => setPhotoSliderIndex((prev) => (prev === 0 ? selectedReport.photos!.length - 1 : prev - 1))}
                                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition z-10"
                                                    title="Previous photo"
                                                >
                                                    ◀
                                                </button>

                                                <button
                                                    onClick={() => setPhotoSliderIndex((prev) => (prev === selectedReport.photos!.length - 1 ? 0 : prev + 1))}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition z-10"
                                                    title="Next photo"
                                                >
                                                    ▶
                                                </button>

                                                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                                                    {photoSliderIndex + 1} / {selectedReport.photos.length}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div>
                                    <label className="text-sm font-semibold text-gray-900">Name</label>
                                    <p className="text-gray-700 mt-1">{selectedReport.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-900">Email</label>
                                    <p className="text-gray-700 mt-1">{selectedReport.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div>
                                    <label className="text-sm font-semibold text-gray-900">Phone</label>
                                    <p className="text-gray-700 mt-1">{selectedReport.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-900">Region</label>
                                    <p className="text-gray-700 mt-1">{selectedReport.region}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div>
                                    <label className="text-sm font-semibold text-gray-900">Date</label>
                                    <p className="text-gray-700 mt-1">{selectedReport.date}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-900">Consulted</label>
                                    <p className="text-gray-700 mt-1">{selectedReport.consulted}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-900">Operating Company</label>
                                <p className="text-gray-700 mt-1">{selectedReport.operatingCompany || 'N/A'}</p>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-900">Issue Description</label>
                                <p className="text-gray-700 mt-1 whitespace-pre-wrap">{selectedReport.issue}</p>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-900">Observations & Impact</label>
                                <p className="text-gray-700 mt-1 whitespace-pre-wrap">{selectedReport.observations}</p>
                            </div>

                            {selectedReport.relevantLinks && selectedReport.relevantLinks.length > 0 && (
                                <div>
                                    <label className="text-sm font-semibold text-gray-900">Relevant Links</label>
                                    <ul className="mt-1 space-y-1">
                                        {selectedReport.relevantLinks.map((link, idx) => (
                                            <li key={idx}>
                                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
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
