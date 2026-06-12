
import React, { useState } from 'react';
import { XMarkIcon, ArrowsPointingOutIcon, ArrowTopRightOnSquareIcon } from '@/components/ui/icons';
import { Project } from '@/types/types';

interface ProjectDetailModalProps {
    project: Project | null;
    onClose: () => void;
}

const DetailRow: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => {
    if (!value || value.trim() === 'N/A' || value.trim() === '') return null;
    return (
        <div className="mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-gray-800 whitespace-pre-wrap">{value}</p>
        </div>
    );
};

interface AccordionSection {
    title: string;
    content: React.ReactNode;
}

const AccordionItem: React.FC<{ section: AccordionSection; isOpen: boolean; onToggle: () => void }> = ({
    section,
    isOpen,
    onToggle,
}) => {
    return (
        <div className="border-b border-gray-200">
            <button
                onClick={onToggle}
                className="w-full px-0 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
                <h3 className="text-lg font-bold text-brand-dark-blue text-left">{section.title}</h3>
                <svg
                    className={`w-5 h-5 text-brand-dark-blue transition-transform duration-300 ${
                        isOpen ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </button>
            {isOpen && <div className="pb-4 pt-0">{section.content}</div>}
        </div>
    );
};


const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        'Project Information': true,
        'Financials': false,
        'Status & Dates': false,
        'Safeguards & Documents': false,
        'Community & Actions': false,
        'Additional Information': false,
    });

    const toggleSection = (sectionTitle: string) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionTitle]: !prev[sectionTitle],
        }));
    };

    if (!project) return null;

    const parseDetails = (details: string) => {
        const detailsMap = new Map<string, string>();
        if (!details) return detailsMap;
        
        const lines = details.replace(/\n---\n/g, '\n').split('\n');
        
        let currentKey: string | null = null;
        
        for (const line of lines) {
            const match = line.match(/^\*\*(.*?):\*\*(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim();
                detailsMap.set(key, value);
                currentKey = key;
            } else if (currentKey) {
                const existingValue = detailsMap.get(currentKey) || '';
                detailsMap.set(currentKey, `${existingValue}\n${line.trim()}`);
            }
        }
        return detailsMap;
    };

    const detailsMap = parseDetails(project.details);

    const sections: AccordionSection[] = [
        {
            title: 'Project Information',
            content: (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <DetailRow label="Region" value={detailsMap.get('Region')} />
                        <DetailRow label="Country" value={project.country} />
                        <DetailRow label="City" value={detailsMap.get('City')} />
                    </div>
                    <DetailRow label="Project Number" value={detailsMap.get('Project Number')} />
                    <DetailRow label="Project description" value={detailsMap.get('Project Description')} />
                </>
            ),
        },
        {
            title: 'Financials',
            content: (
                <>
                    <DetailRow label="International financial institution (IFI)" value={detailsMap.get('IFI')} />
                    <DetailRow label="Funding source" value={detailsMap.get('Funding Source')} />
                    <DetailRow label="Total Project Amount" value={detailsMap.get('Total Project Amount')} />
                    <DetailRow label="Owner" value={detailsMap.get('Owner')} />
                    <DetailRow label="Private Sector Borrower(s)" value={detailsMap.get('Private Sector Borrowers')} />
                </>
            ),
        },
        {
            title: 'Status & Dates',
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailRow label="Project Status" value={detailsMap.get('Project Status')} />
                    <DetailRow label="Start date" value={detailsMap.get('Start Date')} />
                    <DetailRow label="End date" value={detailsMap.get('End Date')} />
                </div>
            ),
        },
        {
            title: 'Safeguards & Documents',
            content: (
                <>
                    <DetailRow label="Environmental" value={detailsMap.get('Environmental Category')} />
                    <DetailRow label="Social Safeguard categories" value={detailsMap.get('Social Safeguard Categories')} />
                </>
            ),
        },
        {
            title: 'Community & Actions',
            content: (
                <>
                    <DetailRow label="Groups in opposition" value={detailsMap.get('Groups in Opposition')} />
                    <DetailRow label="Types of actions" value={detailsMap.get('Types of Actions')} />
                    <DetailRow label="Links to actions" value={detailsMap.get('Links to Actions')} />
                    <DetailRow label="Active GAIA support?" value={detailsMap.get('Active GAIA Support')} />
                </>
            ),
        },
        {
            title: 'Additional Information',
            content: (
                <>
                    <DetailRow label="Gender concerns" value={detailsMap.get('Gender Concerns')} />
                    <DetailRow label="Waste workers" value={detailsMap.get('Waste Workers')} />
                    <DetailRow label="Displacement" value={detailsMap.get('Displacement')} />
                    <DetailRow label="Notes" value={detailsMap.get('Notes')} />
                    <DetailRow label="References" value={detailsMap.get('References')} />
                </>
            ),
        },
    ];

    return (
        <>
            {project && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
            )}
            <div 
                className={`fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-1/2 bg-white shadow-xl z-50 overflow-y-auto transition-transform duration-300 ease-out ${
                    project ? 'translate-x-0' : 'translate-x-full'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 sm:p-6 border-b flex-shrink-0 bg-white sticky top-0 z-10">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 pr-4">
                            <p className="text-sm font-bold text-gray-500 tracking-widest">{project.country}</p>
                            <h2 className="text-base sm:text-lg md:text-xl font-bold text-brand-dark-blue mt-1">{project.title}</h2>
                            <p className="text-sm text-gray-600 mt-2">Approval Date: {project.date}</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-gray-500 hover:text-gray-800 text-3xl leading-none flex-shrink-0"
                        >
                            &times;
                        </button>
                    </div>
                </div>
                <div className="p-4 sm:p-6 pb-6">
                    <DetailRow label="False Solution Type(s)" value={project.corruptionType} />

                    <div className="mt-6">
                        {sections.map((section) => (
                            <AccordionItem
                                key={section.title}
                                section={section}
                                isOpen={openSections[section.title]}
                                onToggle={() => toggleSection(section.title)}
                            />
                        ))}
                    </div>
                    <div className="pb-4"></div>
                </div>
                <div className="p-4 flex justify-end bg-gray-50 border-t fixed bottom-0 right-0 w-full md:w-2/3 lg:w-1/2">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProjectDetailModal;
