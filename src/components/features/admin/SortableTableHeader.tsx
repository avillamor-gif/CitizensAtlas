
import React from 'react';
import { SortConfig } from './useTable';
import { ChevronDownIcon, ChevronUpDownIcon } from '@/components/ui/icons';

interface SortableTableHeaderProps<T> {
    label: string;
    sortKey: keyof T;
    sortConfig: SortConfig<T> | null;
    requestSort: (key: keyof T) => void;
    className?: string;
}

const SortableTableHeader = <T,>({
    label,
    sortKey,
    sortConfig,
    requestSort,
    className = "px-6 py-4 font-bold text-brand-dark-blue"
}: SortableTableHeaderProps<T>) => {
    
    const isSorted = sortConfig && sortConfig.key === sortKey;
    const isAscending = isSorted && sortConfig.direction === 'ascending';
    
    return (
        <th scope="col" className={className}>
            <button
                type="button"
                onClick={() => requestSort(sortKey)}
                className="flex items-center gap-2 hover:text-brand-light-blue transition-colors"
                aria-label={`Sort by ${label}`}
            >
                {label}
                {isSorted ? (
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${isAscending ? 'rotate-180' : ''}`} />
                ) : (
                    <ChevronUpDownIcon className="w-4 h-4 text-gray-400" />
                )}
            </button>
        </th>
    );
};

export default SortableTableHeader;
