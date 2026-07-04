
import React, { useState } from 'react';
import { XMarkIcon, ArrowsPointingOutIcon, ArrowTopRightOnSquareIcon } from '@/components/ui/icons';
import { Project } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectDetailModalProps {
    project: Project | null;
    onClose: () => void;
    onEdit?: (project: Project) => void;
    isSidePanel?: boolean;
}

// Helper function to clean up HTML and preserve only essential formatting
const sanitizeHtml = (html: string): string => {
    if (!html) return '';
    
    // Remove empty tags
    let cleaned = html.replace(/<p[^>]*><\/p>/gi, '')
                       .replace(/<div[^>]*><\/div>/gi, '')
                       .replace(/<br\s*\/?>/gi, '')
                       .trim();
    
    if (!cleaned) return '';
    
    // Add wrapper for proper HTML rendering
    return `<div>${cleaned}</div>`;
};

const DetailRow: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => {
    if (!value || value.trim() === 'N/A' || value.trim() === '') return null;
    
    const cleanedValue = sanitizeHtml(value);
    
    // Don't show if cleaned value is empty
    if (!cleanedValue || cleanedValue.includes('<div></div>')) return null;
    
    return (
        <div className="mb-2 w-full overflow-hidden">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
            {/* Render HTML content properly with styling for links */}
            <div 
                className="text-sm text-gray-800 break-words w-full overflow-x-hidden [&_p]:m-0 [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800 [&_a]:break-words [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:my-1"
                dangerouslySetInnerHTML={{ __html: cleanedValue }}
            />
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
                className="w-full px-3 sm:px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <h3 className="text-sm font-bold text-brand-dark-blue text-left">{section.title}</h3>
                <svg
                    className={`w-4 h-4 text-brand-dark-blue transition-transform duration-300 flex-shrink-0 ml-2 ${
                        isOpen ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </button>
            {isOpen && <div className="pb-3 pt-3 px-3 sm:px-4">{section.content}</div>}
        </div>
    );
};


const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose, onEdit, isSidePanel = false }) => {
    const { user } = useAuth();
    const isAuthorized = !!user && (user.role === 'super-admin' || user.role === 'admin');
    
    const getStatusColor = (status: string | undefined): string => {
        if (!status) return 'bg-gray-500';
        const statusLower = status.toLowerCase().trim();
        if (statusLower.includes('proposed')) return 'bg-amber-500';
        if (statusLower.includes('inactive')) return 'bg-gray-500';
        if (statusLower.includes('active')) return 'bg-green-500';
        if (statusLower.includes('canceled') || statusLower.includes('cancelled')) return 'bg-red-500';
        return 'bg-blue-500';
    };

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        'Project Information': true,
        'Financial Information': false,
        'Environmental and Social Safeguards': false,
        'Just Transition Indicators': false,
        'Community Opposition & Actions': false,
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
            const match = line.match(/^\s*\*\*(.*?):\*\*(.*)$/);
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
                    <div className="mb-2">
                        <div className="flex gap-3 text-xs">
                            {detailsMap.get('Region') && <span><span className="font-bold text-gray-500 uppercase">Region:</span> {detailsMap.get('Region')}</span>}
                            {project.country && <span><span className="font-bold text-gray-500 uppercase">Country:</span> {project.country}</span>}
                            {detailsMap.get('City') && <span><span className="font-bold text-gray-500 uppercase">City:</span> {detailsMap.get('City')}</span>}
                        </div>
                    </div>
                    <DetailRow label="Project Number" value={detailsMap.get('Project Number')} />
                    <DetailRow label="Project description" value={detailsMap.get('Project Description')} />
                </>
            ),
        },
        {
            title: 'Financial Information',
            content: (
                <>
                    <DetailRow label="International financial institution (IFI)" value={detailsMap.get('IFI')} />
                    <DetailRow label="Funding source" value={detailsMap.get('Funding Source')} />
                    <DetailRow label="Total Project Amount" value={detailsMap.get('Total Project Amount')} />
                    <DetailRow label="Owner" value={detailsMap.get('Owner')} />
                    <DetailRow label="Private Sector Borrower(s)" value={detailsMap.get('Private Sector Borrowers')} />
                    <DetailRow label="Economic Cooperation or Programs" value={detailsMap.get('Economic Cooperation or Programs')} />
                    <DetailRow label="Other Implementors" value={detailsMap.get('Other Implementors')} />
                </>
            ),
        },
        {
            title: 'Environmental and Social Safeguards',
            content: (
                <>
                    <DetailRow label="IFI Safeguards" value={detailsMap.get('IFI Safeguards')} isHtml={false} />
                </>
            ),
        },
        {
            title: 'Just Transition Indicators',
            content: (
                <>
                    <DetailRow label="Gender concerns" value={detailsMap.get('Gender Concerns')} />
                    <DetailRow label="Waste workers" value={detailsMap.get('Waste Workers')} />
                    <DetailRow label="Resettlement" value={detailsMap.get('Resettlement')} />
                </>
            ),
        },
        {
            title: 'Community Opposition & Actions',
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
                    <DetailRow label="Notes" value={detailsMap.get('Notes')} />
                    <DetailRow label="References" value={detailsMap.get('References')} />
                </>
            ),
        },
    ];

    // Side panel layout (for map page split view)
    if (isSidePanel) {
        return (
            <div className="flex-[0_0_35%] bg-white border-l border-gray-200 flex flex-col overflow-hidden">
                <div className="p-3 sm:p-4 border-b flex-shrink-0 bg-white sticky top-0 z-10">
                    <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">{project.country}</p>
                            <h2 className="text-sm sm:text-base font-bold text-brand-dark-blue mt-1 leading-tight">{project.title}</h2>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                                {detailsMap.get('Project Status') && (
                                    <>
                                        <span className={`${getStatusColor(detailsMap.get('Project Status'))} text-white font-bold px-2 py-0.5 rounded-full animate-blink`}>
                                            {detailsMap.get('Project Status')}
                                        </span>
                                        <span className="text-gray-400">|</span>
                                    </>
                                )}
                                <span>Approval: {project.date}</span>
                                {detailsMap.get('Start Date') && (
                                    <>
                                        <span className="text-gray-400">|</span>
                                        <span>Start: {detailsMap.get('Start Date')}</span>
                                    </>
                                )}
                            </div>
                            <div className="mt-2">
                                <DetailRow label="False Solution Type(s)" value={project.corruptionType} />
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-gray-500 hover:text-gray-800 text-2xl leading-none flex-shrink-0 pt-1"
                        >
                            &times;
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-0 pb-20">
                    <div>
                        {sections.map((section) => (
                            <AccordionItem
                                key={section.title}
                                section={section}
                                isOpen={openSections[section.title]}
                                onToggle={() => toggleSection(section.title)}
                            />
                        ))}
                    </div>
                </div>
                <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-end gap-2 bg-gray-50 border-t flex-shrink-0">
                    {isAuthorized && onEdit && (
                        <button 
                            type="button" 
                            onClick={() => onEdit(project!)} 
                            className="w-full sm:w-auto bg-brand-dark-blue text-white font-bold py-2 px-4 sm:px-6 rounded text-sm hover:bg-brand-medium-blue transition-colors"
                        >
                            Edit
                        </button>
                    )}
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-2 px-4 sm:px-6 rounded text-sm hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    // Overlay layout (for other pages/modals)
    return (
        <>
            {project && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={onClose} />
            )}
            <div 
                className={`fixed inset-y-0 right-0 w-full sm:w-96 lg:w-[35%] bg-white shadow-2xl z-50 overflow-y-auto transition-smooth-slide ${
                    project ? 'translate-x-0' : 'translate-x-full'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-3 sm:p-4 border-b flex-shrink-0 bg-white sticky top-0 z-10">
                    <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">{project.country}</p>
                            <h2 className="text-sm sm:text-base font-bold text-brand-dark-blue mt-1 leading-tight">{project.title}</h2>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                                {detailsMap.get('Project Status') && (
                                    <>
                                        <span className={`${getStatusColor(detailsMap.get('Project Status'))} text-white font-bold px-2 py-0.5 rounded-full animate-blink`}>
                                            {detailsMap.get('Project Status')}
                                        </span>
                                        <span className="text-gray-400">|</span>
                                    </>
                                )}
                                <span>Approval: {project.date}</span>
                                {detailsMap.get('Start Date') && (
                                    <>
                                        <span className="text-gray-400">|</span>
                                        <span>Start: {detailsMap.get('Start Date')}</span>
                                    </>
                                )}
                            </div>
                            <div className="mt-2">
                                <DetailRow label="False Solution Type(s)" value={project.corruptionType} />
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-gray-500 hover:text-gray-800 text-2xl leading-none flex-shrink-0 pt-1"
                        >
                            &times;
                        </button>
                    </div>
                </div>
                <div className="px-0 pb-20">
                    <div>
                        {sections.map((section) => (
                            <AccordionItem
                                key={section.title}
                                section={section}
                                isOpen={openSections[section.title]}
                                onToggle={() => toggleSection(section.title)}
                            />
                        ))}
                    </div>
                </div>
                <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-end gap-2 bg-gray-50 border-t fixed bottom-0 right-0 w-full sm:w-96 lg:w-[35%]">
                    {isAuthorized && onEdit && (
                        <button 
                            type="button" 
                            onClick={() => onEdit(project!)} 
                            className="w-full sm:w-auto bg-brand-dark-blue text-white font-bold py-2 px-4 sm:px-6 rounded text-sm hover:bg-brand-medium-blue transition-colors"
                        >
                            Edit
                        </button>
                    )}
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-2 px-4 sm:px-6 rounded text-sm hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProjectDetailModal;
