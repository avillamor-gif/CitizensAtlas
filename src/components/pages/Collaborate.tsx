
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRightIcon } from '@/components/ui/icons';
import { PartnerReport } from '@/types/types';
import PartnerReportCarousel from './PartnerReportCarousel';

const Collaborate: React.FC = () => {
    const [approvedReports, setApprovedReports] = useState<PartnerReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApprovedReports();
    }, []);

    const fetchApprovedReports = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/partner-reports?status=approved');
            const data = await response.json();
            const reports = data.reports || [];
            setApprovedReports(reports);
        } catch (error) {
            console.error('Error fetching approved reports:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || approvedReports.length === 0) {
        return null;
    }

    return (
        <section className="py-16 px-4 sm:px-8 text-white border-t" style={{ backgroundColor: 'var(--deep)', borderColor: 'rgba(255, 165, 0, 0.1)' }}>
            <div className="container mx-auto">
                <div className="text-center">
                    <div className="mb-12">
                        <h2 className="text-4xl font-extrabold mb-2">CITIZEN'S REPORT</h2>
                        <div className="h-1 mb-4 mx-auto" style={{ width: '64px', backgroundColor: 'var(--highlight)' }}></div>
                        <p className="text-lg text-gray-300 max-w-3xl mb-8 mx-auto">
                            Community members have submitted the following reports about false solutions in their areas. Help us strengthen this database by sharing your own experiences.
                        </p>
                    </div>
                    <PartnerReportCarousel reports={approvedReports} />
                    <div className="mt-12 text-center">
                        <a href="mailto:citizensatlas@no-burn.org" className="inline-flex items-center text-lg font-bold hover:opacity-80 transition-colors" style={{ color: 'var(--highlight)' }}>
                            <span className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: 'var(--highlight)', color: '#0a1628' }}>
                                <ArrowRightIcon className="w-5 h-5" />
                            </span>
                            Share your own report
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Collaborate;
