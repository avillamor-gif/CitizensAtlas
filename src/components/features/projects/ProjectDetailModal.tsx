
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

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-bold text-brand-dark-blue mt-6 mb-3 border-t pt-4">
        {children}
    </h3>
);


const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full my-8" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b sticky top-0 bg-white rounded-t-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-bold text-gray-500 tracking-widest">{project.country}</p>
                            <h2 className="text-2xl font-bold text-brand-dark-blue mt-1">{project.title}</h2>
                            <p className="text-sm text-gray-600 mt-2">Approval Date: {project.date}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none flex-shrink-0 ml-4">&times;</button>
                    </div>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <DetailRow label="False Solution Type(s)" value={project.corruptionType} />

                    <SectionTitle>Project Information</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <DetailRow label="Region" value={detailsMap.get('Region')} />
                        <DetailRow label="Country" value={project.country} />
                        <DetailRow label="City" value={detailsMap.get('City')} />
                    </div>
                    <DetailRow label="Project Number" value={detailsMap.get('Project Number')} />
                    <DetailRow label="Project description" value={detailsMap.get('Project Description')} />

                    <SectionTitle>Financials</SectionTitle>
                    <DetailRow label="International financial institution (IFI)" value={detailsMap.get('IFI')} />
                    <DetailRow label="Funding source" value={detailsMap.get('Funding Source')} />
                    <DetailRow label="Total Project Amount" value={detailsMap.get('Total Project Amount')} />
                    <DetailRow label="Owner" value={detailsMap.get('Owner')} />
                    <DetailRow label="Private Sector Borrower(s)" value={detailsMap.get('Private Sector Borrowers')} />

                    <SectionTitle>Status & Dates</SectionTitle>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailRow label="Project Status" value={detailsMap.get('Project Status')} />
                        <DetailRow label="Start date" value={detailsMap.get('Start Date')} />
                        <DetailRow label="End date" value={detailsMap.get('End Date')} />
                    </div>

                    <SectionTitle>Safeguards & Documents</SectionTitle>
                    <DetailRow label="Environmental" value={detailsMap.get('Environmental Category')} />
                    <DetailRow label="Social Safeguard categories" value={detailsMap.get('Social Safeguard Categories')} />
                    {/* Key Documents would be here if file upload was fully implemented */}

                    <SectionTitle>Community & Actions</SectionTitle>
                    <DetailRow label="Groups in opposition" value={detailsMap.get('Groups in Opposition')} />
                    <DetailRow label="Types of actions" value={detailsMap.get('Types of Actions')} />
                    <DetailRow label="Links to actions" value={detailsMap.get('Links to Actions')} />
                    <DetailRow label="Active GAIA support?" value={detailsMap.get('Active GAIA Support')} />
                    
                    <SectionTitle>Additional Information</SectionTitle>
                    <DetailRow label="Gender concerns" value={detailsMap.get('Gender Concerns')} />
                    <DetailRow label="Waste workers" value={detailsMap.get('Waste Workers')} />
                    <DetailRow label="Displacement" value={detailsMap.get('Displacement')} />
                    <DetailRow label="Notes" value={detailsMap.get('Notes')} />
                    <DetailRow label="References" value={detailsMap.get('References')} />
                </div>
                <div className="p-4 flex justify-end space-x-4 bg-gray-50 border-t rounded-b-lg sticky bottom-0">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-md hover:bg-gray-300 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailModal;
