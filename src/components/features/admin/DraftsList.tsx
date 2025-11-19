import React, { useState } from 'react';
import { Project, Article } from '@/types/types';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon, MagnifyingGlassIcon } from '@/components/ui/icons';
import Pagination from './Pagination';
import { useTable } from './useTable';
import SortableTableHeader from './SortableTableHeader';
import Checkbox from './Checkbox';

type DraftItem = (Project | Article) & { type: 'project' | 'news' | 'publication' | 'video' };

interface DraftsListProps {
    projects: Project[];
    news: Article[];
    publications: Article[];
    videos: Article[];
    onApprove: (item: DraftItem) => void;
    onReject: (item: DraftItem) => void;
    onEdit: (item: DraftItem) => void;
    filterType?: 'all' | 'project' | 'news' | 'publication' | 'video';
}

const DraftsList: React.FC<DraftsListProps> = ({ 
    projects, 
    news, 
    publications, 
    videos, 
    onApprove, 
    onReject, 
    onEdit,
    filterType = 'all'
}) => {
    // Combine all drafts
    const allDrafts: DraftItem[] = [
        ...projects.filter(p => p.status === 'draft').map(p => ({ ...p, type: 'project' as const })),
        ...news.filter(n => n.status === 'draft').map(n => ({ ...n, type: 'news' as const })),
        ...publications.filter(p => p.status === 'draft').map(p => ({ ...p, type: 'publication' as const })),
        ...videos.filter(v => v.status === 'draft').map(v => ({ ...v, type: 'video' as const })),
    ];

    const filteredDrafts = filterType === 'all' 
        ? allDrafts 
        : allDrafts.filter(d => d.type === filterType);

    // Debug logging
    console.log('📋 DraftsList Debug:');
    console.log('  Total Projects:', projects.length);
    console.log('  Total News:', news.length);
    console.log('  Draft Projects:', projects.filter(p => p.status === 'draft').length);
    console.log('  Draft News:', news.filter(n => n.status === 'draft').length);
    console.log('  All Drafts:', allDrafts.length);
    console.log('  Filter Type:', filterType);
    console.log('  News items:', news.map(n => ({ id: n.id, title: n.title, status: n.status })));

    const {
        paginatedItems,
        requestSort,
        setSearchTerm,
        sortConfig,
        currentPage,
        totalPages,
        handlePageChange,
        selectedItems,
        setSelectedItems,
        handleSelectItem,
        handleSelectAll,
        isAllSelected,
    } = useTable<DraftItem>({
        items: filteredDrafts,
        initialSortConfig: { key: 'submittedAt', direction: 'descending' },
        searchableFields: ['title'],
        itemsPerPage: 20
    });

    const handleApprove = (item: DraftItem) => {
        console.log('🔘 Approve button clicked for:', item);
        if (window.confirm(`Approve "${item.title}"?`)) {
            console.log('✅ User confirmed approval, calling onApprove...');
            onApprove(item);
        } else {
            console.log('❌ User cancelled approval');
        }
    };

    const handleReject = (item: DraftItem) => {
        if (window.confirm(`Reject and delete "${item.title}"? This cannot be undone.`)) {
            onReject(item);
        }
    };

    const getTypeBadge = (type: string) => {
        const colors = {
            project: 'bg-blue-100 text-blue-800',
            news: 'bg-green-100 text-green-800',
            publication: 'bg-purple-100 text-purple-800',
            video: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded ${colors[type as keyof typeof colors]}`}>
                {type.toUpperCase()}
            </span>
        );
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-brand-dark-blue">Pending Approvals</h2>
                    <p className="text-gray-600 mt-1">
                        Review and approve submissions from contributors ({paginatedItems.length} pending)
                    </p>
                </div>
            </div>

            {selectedItems.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-blue-100 border border-blue-200 rounded-lg mb-4">
                    <p className="text-sm font-medium text-blue-800">{selectedItems.length} item(s) selected.</p>
                </div>
            )}

            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-9 border border-gray-300 rounded-md focus:ring-brand-medium-blue focus:border-brand-medium-blue"
                        aria-label="Search drafts"
                    />
                    <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <div className="bg-white border rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <SortableTableHeader label="Title" sortKey="title" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableTableHeader label="Submitted By" sortKey="submittedBy" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableTableHeader label="Submitted At" sortKey="submittedAt" sortConfig={sortConfig} requestSort={requestSort} />
                                    <th className="px-6 py-4">Submission For</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No pending drafts to review
                                    </td>
                                </tr>
                            ) : (
                                paginatedItems.map(item => (
                                    <tr key={`${item.type}-${item.id}`} className={`border-b transition-colors ${selectedItems.includes(item.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                                        <td className="px-6 py-4 font-medium max-w-sm truncate">{item.title}</td>
                                        <td className="px-6 py-4">{item.submittedBy || 'Unknown'}</td>
                                        <td className="px-6 py-4">{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-6 py-4 font-semibold capitalize">
                                            {item.type === 'project' && 'Projects'}
                                            {item.type === 'news' && 'News Updates'}
                                            {item.type === 'publication' && 'Publications'}
                                            {item.type === 'video' && 'Videos'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end items-center space-x-3">
                                                <button 
                                                    onClick={() => handleApprove(item)}
                                                    className="text-green-600 hover:text-green-800 transition-colors"
                                                    aria-label={`Approve ${item.title}`}
                                                    title="Approve"
                                                >
                                                    <CheckIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    aria-label={`Edit ${item.title}`}
                                                    title="Edit"
                                                >
                                                    <PencilIcon />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(item)}
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                    aria-label={`Reject ${item.title}`}
                                                    title="Reject"
                                                >
                                                    <XMarkIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default DraftsList;
